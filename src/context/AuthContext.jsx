import { createContext, useState, useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';  
import axiosInstance from '../api/axios.js'; 
import { useNavigate } from 'react-router-dom'; 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const navigate = useNavigate(); 

    useEffect(() => {
        if (token) {
            axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post('/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setUser(user);
            setToken(token);

            toast.success('Inicio de sesión exitoso'); 

            navigate('/dashboard'); 
        } catch (error) {
            console.error('Error al iniciar sesión', error);
            toast.error('Credenciales incorrectas');  
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        toast.info('Sesión cerrada');  
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
            <ToastContainer />  
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
