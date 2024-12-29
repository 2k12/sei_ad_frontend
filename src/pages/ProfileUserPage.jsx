import { useEffect, useState } from "react";
import { useUsers } from "../context/UserContext";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

const ProfileUserPage = () => {
    const { users, updateUser } = useUsers();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [editingUserInfo, setEditingUserInfo] = useState(false);
    const [userData, setUserData] = useState({ name: "", email: "", active: false });
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

    // useEffect(() => {
    //     const userFromState = location.state?.user;
    //     const getUserData = (selectedUser) => {
    //         setUser(selectedUser);
    //         setUserData({
    //             name: selectedUser.name,
    //             email: selectedUser.email,
    //             active: selectedUser.active,
    //         });
    //         setRoles(Array.isArray(selectedUser.roles) ? selectedUser.roles : []);
    //         const allPermissions = selectedUser.roles?.reduce((acc, role) => {
    //             if (Array.isArray(role.permissions)) {
    //                 return [...acc, ...role.permissions];
    //             }
    //             return acc;
    //         }, []) || [];
    //         setPermissions(allPermissions);
    //     };

    //     if (userFromState) {
    //         getUserData(userFromState);
    //     } else {
    //         const userId = parseInt(location.pathname.split("/").pop(), 10);
    //         const selectedUser = users.find((u) => u.id === userId);
    //         if (selectedUser) {
    //             getUserData(selectedUser);
    //         }
    //     }
    // }, [users, location]);
    useEffect(() => {
        if (!user) {
            const userId = parseInt(location.pathname.split("/").pop(), 10);
            const selectedUser = users.find((u) => u.id === userId);
            if (selectedUser) {
                setUser(selectedUser);
                setUserData({
                    name: selectedUser.name,
                    email: selectedUser.email,
                    active: selectedUser.active,
                });
                setRoles(Array.isArray(selectedUser.roles) ? selectedUser.roles : []);
                const allPermissions = selectedUser.roles?.reduce((acc, role) => {
                    if (Array.isArray(role.permissions)) {
                        return [...acc, ...role.permissions];
                    }
                    return acc;
                }, []) || [];
                setPermissions(allPermissions);
            }
        }
    }, [location]); // Elimina la dependencia de `users`


    const handleSaveUserInfo = () => {
        updateUser(user.id, userData);
        setEditingUserInfo(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-600">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
                    Perfil de Usuario
                </h1>
                {user ? (
                    <>
                        {/* Información Personal */}
                        <div className="mb-6 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                Información Personal
                            </h2>
                            {!editingUserInfo ? (
                                <div className="space-y-4 text-gray-800">
                                    <div>
                                        <strong className="block text-sm font-medium text-gray-700 dark:text-white">Nombre</strong>
                                        <p>{userData.name}</p>
                                    </div>
                                    <div>
                                        <strong className="block text-sm font-medium text-gray-700 dark:text-white">Correo Electrónico</strong>
                                        <p>{userData.email}</p>
                                    </div>
                                    <div>
                                        <strong className="block text-sm font-medium text-gray-700 dark:text-white">Estado</strong>
                                        <p>{userData.active ? "Activo" : "Inactivo"}</p>
                                    </div>
                                    <button
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                        onClick={() => setEditingUserInfo(true)}
                                    >
                                        Editar
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">
                                            Nombre
                                        </label>
                                        <input
                                            id="name"
                                            className="w-full sm:w-96 p-3 text-black bg-white rounded-lg border border-gray-300 dark:border-gray-600"
                                            value={userData.name}
                                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                            placeholder="Nombre"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
                                            Correo Electrónico
                                        </label>
                                        <input
                                            id="email"
                                            className="w-full sm:w-96 p-3 text-black bg-white rounded-lg border border-gray-300 dark:border-gray-600"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            placeholder="Correo Electrónico"
                                        />
                                    </div>
                                    <div className="flex justify-start space-x-4">
                                        <button
                                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                            onClick={handleSaveUserInfo}
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                            onClick={() => setEditingUserInfo(false)}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Roles */}
                        <div className="mb-6 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Roles</h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {roles.length > 0 ? (
                                    roles.map((role, index) => (
                                        <div key={index} className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow-md">
                                            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">{role.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-300">No hay roles disponibles</p>
                                )}
                            </div>
                        </div>

                        {/* Permisos */}
                        <div className="mb-6 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Permisos</h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {permissions.length > 0 ? (
                                    permissions.map((permission, index) => (
                                        <div key={index} className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow-md">
                                            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">{permission.name}</h3>
                                            {permission.module && (
                                                <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                                    Módulo {permission.module.name}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-300">No hay permisos disponibles</p>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 dark:text-gray-300">Cargando...</p>
                )}
            </div>
        </div>
    );
};

export default ProfileUserPage;
