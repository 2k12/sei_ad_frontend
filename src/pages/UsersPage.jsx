import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import EditUserForm from "../components/EditUserForm";
import Navbar from "../components/Navbar";

const UsersPage = () => {
    const { users, fetchUsers, updateUser, createUser, loading, pagination } = useUsers();
    const [filters, setFilters] = useState({ name: "", email: "", active: "" });
    const [editingUser, setEditingUser] = useState(null); // Usuario en edición
    const [addingUser, setAddingUser] = useState(false); // Controla el modal de agregar usuario
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", active: true });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers({ page: pagination.page, pageSize: pagination.limit, ...filters });
    }, [pagination.page, pagination.limit, filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleToggleActive = (id, active) => {
        updateUser(id, { active: !active });
    };

    const handlePageChange = (newPage) => {
        fetchUsers({ page: newPage, pageSize: pagination.limit, ...filters });
    };

    const handleEditUser = (user) => {
        setEditingUser(user); 
    };

    const handleSaveUser = (id, updatedData) => {
        updateUser(id, updatedData); 
        setEditingUser(null); 
    };

    const handleCancelEdit = () => {
        setEditingUser(null); 
    };

    const handleAddUser = () => {
        createUser(newUser);
        setAddingUser(false); // Cierra el modal después de crear el usuario
        setNewUser({ name: "", email: "", password: "", active: true }); // Reinicia el formulario
    };

    const handleNewUserChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewUser({ ...newUser, [name]: type === "checkbox" ? checked : value });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-400 mb-6">Gestión de Usuarios</h1>

                <div className="mb-6 flex gap-4 items-center">
                    <input
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="Search by name"
                        className="w-full md:w-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                    />
                    <input
                        name="email"
                        value={filters.email}
                        onChange={handleFilterChange}
                        placeholder="Search by email"
                        className="w-full md:w-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                    />
                    <select
                        name="active"
                        value={filters.active}
                        onChange={handleFilterChange}
                        className="w-full md:w-48 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                    >
                        <option value="">All</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <button
                    onClick={() => setAddingUser(true)}
                    className="mb-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
                >
                    Agregar Usuario
                </button>

                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="table-auto w-full text-sm text-gray-600">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left">Nombre</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Estado</th>
                                <th className="px-6 py-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">Loading...</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-100">
                                        <td className="px-6 py-3">👤 {user.name}</td>
                                        <td className="px-6 py-3">{user.email}</td>
                                        <td className="px-6 py-3">{user.active ? "Activo" : "Inactivo"}</td>
                                        <td className="px-6 py-3">
                                            <button
                                                onClick={() => navigate(`/users/${user.id}`, { state: { user } })}
                                                className="mr-3 px-4 py-2 bg-gray-200 text-green-500 font-semibold rounded-lg shadow-md hover:bg-gray-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                                            >
                                                Ver
                                            </button>

                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="mr-3 px-4 py-2 bg-gray-200 text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(user.id, user.active)}
                                                className="mr-3 px-4 py-2 bg-gray-200 text-orange-500 font-semibold rounded-lg shadow-md hover:bg-gray-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                                            >
                                                Cambiar Estado
                                            </button>
                                            <button
                                                // onClick={() => handleToggleActive(user.id, user.active)}
                                                className="mr-3 px-4 py-2 bg-gray-200 text-red-500 font-semibold rounded-lg shadow-md hover:bg-gray-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                                            >
                                                Reporte Auditoría
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <button
                        disabled={pagination.page === 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700"
                    >
                        Anterior
                    </button>
                    <span className="text-lg text-gray-800 dark:text-gray-800">
                        Pagina {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
                    </span>
                    <button
                        disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700"
                    >
                        Siguiente
                    </button>
                </div>

                {editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                            <EditUserForm
                                user={editingUser}
                                onSave={handleSaveUser}
                                onCancel={handleCancelEdit}
                            />
                        </div>
                    </div>
                )}

                {addingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Agregar Usuario</h2>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newUser.name}
                                        onChange={handleNewUserChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newUser.email}
                                        onChange={handleNewUserChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Contraseña</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={newUser.password}
                                        onChange={handleNewUserChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="mb-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={newUser.active}
                                        onChange={handleNewUserChange}
                                        className="mr-2"
                                    />
                                    <label className="text-gray-700">Activo</label>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setAddingUser(false)}
                                        className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;
