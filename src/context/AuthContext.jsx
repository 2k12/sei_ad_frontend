import { createContext, useState, useContext, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [permissions, setPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
            processToken(token); // Procesar el token
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const processToken = (token) => {
        try {
            const base64Payload = token.split(".")[1];
            const payload = JSON.parse(atob(base64Payload));

            const isExpired = payload.exp * 1000 < Date.now();

            if (isExpired) {
                logout();
                toast.error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                return;
            }

            setUser(payload.user || null);
            setPermissions(payload.permissions || []);
        } catch (error) {
            console.error("Error al procesar el token:", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

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

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        setPermissions([]);
        window.location.href = "/login";
        toast.info("Sesión cerrada");
    };

    const hasPermission = (permission) => {
        return permissions.includes(permission);
    };

    return (
        <AuthContext.Provider value={{ user, token, permissions, login, logout, hasPermission, isLoading }}>
            {children}
            <ToastContainer />
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
