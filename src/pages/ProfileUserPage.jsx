import { useEffect, useState } from "react";
import { useUsers } from "../context/UserContext";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { roleUserApi } from "../api/axios"; // API para roles y permisos

const ProfileUserPage = () => {
    const { users, updateUser } = useUsers();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [editingUserInfo, setEditingUserInfo] = useState(false);
    const [userData, setUserData] = useState({ name: "", email: "", active: false });
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [editingPermissions, setEditingPermissions] = useState(false);
    const [allPermissions, setAllPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [confirmChanges, setConfirmChanges] = useState(false);
    const [changes, setChanges] = useState({ toAdd: [], toRemove: [] });

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
    }, [location]);

    useEffect(() => {
        const fetchAllPermissions = async () => {
            try {
                const response = await roleUserApi.getAllPermissions(); // Endpoint para obtener todos los permisos
                setAllPermissions(response.data.permissions);
            } catch (error) {
                console.error("Error al cargar todos los permisos:", error);
            }
        };

        if (editingPermissions) {
            fetchAllPermissions();
        }
    }, [editingPermissions]);

    const handlePermissionChange = (permissionId) => {
        if (selectedPermissions.includes(permissionId)) {
            setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId));
        } else {
            setSelectedPermissions([...selectedPermissions, permissionId]);
        }
    };

    const handleSavePermissions = () => {
        const currentPermissionIds = permissions.map((perm) => perm.id);
        const toAdd = selectedPermissions.filter((id) => !currentPermissionIds.includes(id));
        const toRemove = currentPermissionIds.filter((id) => !selectedPermissions.includes(id));

        setChanges({ toAdd, toRemove });
        setConfirmChanges(true); // Mostrar modal de confirmación
    };

    const confirmSave = async () => {
        try {
            const roleId = roles[0]?.id; // Tomar el primer rol asociado al usuario
            for (const permissionId of changes.toAdd) {
                await roleUserApi.assignPermission(roleId, permissionId);
            }
            for (const permissionId of changes.toRemove) {
                await roleUserApi.removePermission(roleId, permissionId);
            }
            setPermissions(allPermissions.filter((perm) => selectedPermissions.includes(perm.id)));
            setEditingPermissions(false);
            setConfirmChanges(false); // Cerrar modal de confirmación
        } catch (error) {
            console.error("Error al guardar permisos:", error);
        }
    };

    const handleSaveUserInfo = () => {
        updateUser(user.id, userData);
        setEditingUserInfo(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
                    Perfil de Usuario
                </h1>
                {user ? (
                    <>
                        {/* Información Personal */}
                        <div className="mb-6 bg-white dark:bg-black p-6 rounded-lg shadow-md dark:border border-gray-500">
                            {/* Información Personal */}
                        </div>

                        {/* Roles */}
                        <div className="mb-6 bg-white p-6 rounded-lg shadow-md dark:bg-black dark:border border-gray-500">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                Roles
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {roles.length > 0 ? (
                                    roles.map((role, index) => (
                                        <div key={index} className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow-md">
                                            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                                                {role.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {role.description}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-300">No hay roles disponibles</p>
                                )}
                            </div>
                        </div>

                        {/* Permisos */}
                        <div className="mb-6 bg-white p-6 rounded-lg shadow-md dark:bg-black dark:border border-gray-500">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Permisos</h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {permissions.length > 0 ? (
                                    permissions.map((permission, index) => (
                                        <div key={index} className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow-md">
                                            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                                                {permission.name}
                                            </h3>
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
                            <button
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mt-4"
                                onClick={() => {
                                    setSelectedPermissions(permissions.map((perm) => perm.id));
                                    setEditingPermissions(true);
                                }}
                            >
                                Editar Permisos
                            </button>
                        </div>

                        {editingPermissions && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full max-w-5xl overflow-y-auto">
                                    <h2 className="text-xl font-semibold mb-4 text-center">Editar Permisos</h2>
                                    <div className="grid grid-cols-3 gap-4">
                                        {allPermissions.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                                            >
                                                <label className="flex items-center text-white">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2 accent-green-500"
                                                        checked={selectedPermissions.includes(permission.id)}
                                                        onChange={() => handlePermissionChange(permission.id)}
                                                    />
                                                    {permission.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 ease-in-out mr-2"
                                            onClick={() => setEditingPermissions(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
                                            onClick={handleSavePermissions}
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal de confirmación */}
                        {confirmChanges && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-gradient-to-b from-gray-800 to-black text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                                    <h2 className="text-2xl font-bold mb-4 text-center">Confirmar Cambios</h2>
                                    <div>
                                        <p className="mb-2 font-semibold text-green-400">Permisos a agregar:</p>
                                        <ul className="list-disc list-inside mb-4">
                                            {changes.toAdd.map((id) => {
                                                const permission = allPermissions.find((perm) => perm.id === id);
                                                return (
                                                    <li key={id} className="text-sm">
                                                        {permission?.name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <p className="mb-2 font-semibold text-red-400">Permisos a eliminar:</p>
                                        <ul className="list-disc list-inside">
                                            {changes.toRemove.map((id) => {
                                                const permission = allPermissions.find((perm) => perm.id === id);
                                                return (
                                                    <li key={id} className="text-sm">
                                                        {permission?.name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 ease-in-out mr-2"
                                            onClick={() => setConfirmChanges(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 ease-in-out"
                                            onClick={confirmSave}
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500 dark:text-gray-300">Cargando...</p>
                )}
            </div>
        </div>
    );
};

export default ProfileUserPage;
