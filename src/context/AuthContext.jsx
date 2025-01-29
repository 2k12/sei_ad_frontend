import { createContext, useState, useContext, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [permissions, setPermissions] = useState([]); // Estado para los permisos
    const navigate = useNavigate();

    // Actualizar token y extraer datos al inicializar o cuando el token cambia
    useEffect(() => {
        if (token) {
            axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
            processToken(token); // Procesar el token
        }
    }, [token]);

    // Decodificar el token y extraer información
    const processToken = (token) => {
        try {
            const base64Payload = token.split(".")[1]; // Obtener la parte payload del token
            const payload = JSON.parse(atob(base64Payload)); // Decodificar la parte payload
            setUser(payload.user || null); // Ajusta según la estructura de tu token
            setPermissions(payload.permissions || []); // Ajusta según la estructura de tu token
        } catch (error) {
            console.error("Error al procesar el token:", error);
            logout(); // Si hay un error, cerrar sesión
        }
    };

    // Función para iniciar sesión
    const login = async (email, password, module_key) => {
        try {
            const response = await axiosInstance.post("/login", { email, password, module_key });
            const { token } = response.data;

            localStorage.setItem("token", token);
            setToken(token);
            processToken(token);

            toast.success("Inicio de sesión exitoso");
            navigate("/dashboard");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Error al iniciar sesión";
            toast.error(errorMessage);

            // Si el backend indica que la cuenta está bloqueada, mostramos un mensaje específico
            if (errorMessage.includes("bloqueada")) {
                toast.error("Tu cuenta ha sido bloqueada por múltiples intentos fallidos. Inténtalo más tarde.");
            }
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        setPermissions([]);
        toast.info("Sesión cerrada");
    };

    // Función para verificar si el usuario tiene un permiso específico
    const hasPermission = (permission) => {
        return permissions.includes(permission);
    };

    return (
        <AuthContext.Provider value={{ user, token, permissions, login, logout, hasPermission }}>
            {children}
            <ToastContainer />
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
