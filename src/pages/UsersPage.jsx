import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import EditUserForm from "../components/EditUserForm";
import ReportModalForm from "../components/ReportModalForm";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faEye, faExchange, faFolder } from "@fortawesome/free-solid-svg-icons";


const UsersPage = () => {
    const { users, fetchUsers, updateUser, createUser, loading, pagination } = useUsers();
    const [filters, setFilters] = useState({ email: "", active: "" });
    const [editingUser, setEditingUser] = useState(null);
    const [addingUser, setAddingUser] = useState(false);
    const [modalreport, setShowModalReport] = useState(false);
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
        setAddingUser(false);
        setNewUser({ name: "", email: "", password: "", active: true });
    };

    const handleNewUserChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewUser({ ...newUser, [name]: type === "checkbox" ? checked : value });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-400">Gestión de Usuarios</h1>
                    <div className="mb-6 flex justify-end items-end">
                        <button
                            onClick={() => setAddingUser(true)}
                            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition mr-2"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Agregar
                        </button>
                        <div>
                            <button
                                className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
                                onClick={() => setShowModalReport(true)}
                            >
                                <FontAwesomeIcon icon={faFolder} className="mr-2" />
                                Reportes
                            </button>
                            { modalreport && <ReportModalForm onClose={() => setShowModalReport(false)} />}
                        </div>
                    </div>

                </div>
                <div className="mb-6 flex gap-4 items-center">
                    
                    <input
                        name="email"
                        value={filters.email}
                        onChange={handleFilterChange}
                        placeholder="Buscar por correo electrónico"
                        className="w-full md:w-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                    />
                    <select
                        name="active"
                        value={filters.active}
                        onChange={handleFilterChange}
                        className="w-full md:w-48 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                    >
                        <option value="">Todo</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>

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
                                        <td className="px-6 py-3">{user.active ? (
                                            <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
                                                Inactivo
                                            </span>
                                        )}</td>
                                        <td className="px-6 py-3">
                                            <button
                                                onClick={() => navigate(`/users/${user.id}`, { state: { user } })}
                                                className="mr-3 px-4 py-2 bg-gray-200 text-green-500 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                                                title="Ver usuario"
                                            >
                                                <FontAwesomeIcon icon={faEye} className="" />
                                            </button>

                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="mr-3 px-4 py-2 bg-gray-200 text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                                                title="Editar usuario"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="" />

                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(user.id, user.active)}
                                                className="mr-3 px-4 py-2 bg-gray-200 text-orange-500 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                                                title={user.active ? "Desactivar Usuario" : "Activar Usuario"}
                                            >
                                                <FontAwesomeIcon icon={faExchange} className="" />

                                            </button>
                                            {/* <button
                                                // onClick={() => handleToggleActive(user.id, user.active)}
                                                className="mr-3 px-4 py-2 bg-gray-200 text-red-500 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                                            >
                                                Reporte Auditoría
                                            </button> */}
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
