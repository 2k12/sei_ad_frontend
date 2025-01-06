import { createContext, useContext, useState } from 'react';
import { userApi } from '../api/axios.js';
import { toast } from 'react-toastify';

const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const fetchUsers = async (params = {}) => {
        setLoading(true);
        try {
            const { data } = await userApi.getUsers({
                page: params.page || pagination.page,
                pageSize: params.pageSize || pagination.limit,
                email: params.email || '',
                active: params.active || '',
            });
            setUsers(data.users);
            setPagination({
                page: data.page,
                limit: data.pageSize,
                total: data.total,
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData) => {
        try {
            await userApi.createUser(userData);
            toast.success('Usuario creado satisfactoriamente');
            await fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Error al crear Usuario');
        }
    };

    const updateUser = async (id, userData) => {
        try {
            await userApi.updateUser(id, userData);
            toast.success('Datos del Usuario Actualizados');
            await fetchUsers();

        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Error actulizando los datos del Usuario');

        }
    };

    const deleteUser = async (id) => {
        try {
            await userApi.deleteUser(id);
            toast.success('El estado del Usuario fue actualizado');
            await fetchUsers();

        } catch (error) {
            toast.error('Error actulizando el estado del Usuario');

            console.error('Error deleting user:', error);
        }
    };

    return (
        <UserContext.Provider
            value={{
                users,
                fetchUsers,
                createUser,
                updateUser,
                deleteUser,
                loading,
                pagination,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => useContext(UserContext);