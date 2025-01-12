import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import EditUserForm from "../components/EditUserForm";
import ReportModalForm from "../components/ReportModalForm";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faEye, faFolder } from "@fortawesome/free-solid-svg-icons";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons/faToggleOn";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons/faToggleOff";


const UsersPage = () => {
    const { users, fetchUsers, updateUser, createUser, loading, pagination } = useUsers();
    const [filters, setFilters] = useState({ email: "", active: "" });
    const [editingUser, setEditingUser] = useState(null);
    const [addingUser, setAddingUser] = useState(false);
    const [modalreport, setShowModalReport] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", active: true });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers({ page: pagination.page, pageSize: pagination.limit });
    }, 
    
    [pagination.page, pagination.limit]);

    const handleSearch = () => {
        fetchUsers({ page: pagination.page, pageSize: pagination.limit, ...filters });
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
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="mb-6 text-3xl font-semibold text-gray-800 dark:text-gray-200">Gestión de Usuarios</h1>
                    <div className="mb-6 flex justify-end items-end">
                        <button
                            onClick={() => setAddingUser(true)}
                            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition dark:bg-green-700 dark:hover:bg-green-900 mr-2"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Agregar Usuario
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
                        onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
                        placeholder="Buscar por correo electrónico"
                        className="w-full md:w-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 dark:border-gray-500 dark:bg-gray-800"
                    />
                    <select
                        name="active"
                        value={filters.active}
                        onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
                        className="w-full md:w-48 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 dark:border-gray-500 dark:bg-gray-800"
                    >
                        <option value="">Todo</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-900"
                    >
                        Buscar
                    </button>
                </div>

                {/* Tabla */}
                <div className="mb-4 text-right">
                    <span className="text-lg text-gray-500 dark:text-gray-500">
                        Total de registros: {pagination.total}
                    </span>
                </div>
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg dark:border-gray-500 dark:bg-cyan-950">
                    <table className="table-auto w-full text-sm text-gray-600 dark:text-white">
                        <thead className="bg-gray-200 dark:bg-cyan-800 dark:text-white">
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
                                    <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-cyan-900">
                                        <td className="px-6 py-3">👤 {user.name}</td>
                                        <td className="px-6 py-3">{user.email}</td>
                                        <td className="px-6 py-3">{user.active ? (
                                                <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold dark:bg-green-300 dark:text-green-900">
                                                Activo
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold dark:bg-red-300 dark:text-red-900">
                                                Inactivo
                                                </span>
                                            )}</td>
                                        <td className="px-6 py-3 flex items-center gap-2">
                                            
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="px-3 py-2 bg-gray-200 text-blue-500 rounded-lg hover:bg-gray-400 transition dark:text-gray-200 dark:bg-blue-800 dark:hover:bg-blue-500"
                                                title="Editar usuario"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="" />

                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(user.id, user.active)}
                                                className="px-3 py-2 bg-gray-200 text-orange-500 rounded-lg hover:bg-gray-400 transition dark:bg-gray-300 dark:hover:bg-gray-400"
                                                title={user.active ? "Desactivar Usuario" : "Activar Usuario"}
                                            >
                                                <FontAwesomeIcon icon={user.active ? faToggleOn : faToggleOff} className={user.active ? "text-green-800" : "text-red-800"} />

                                            </button>
                                            <button
                                                onClick={() => navigate(`/users/${user.id}`, { state: { user } })}
                                                className="px-3 py-2 bg-gray-200 text-green-500 rounded-lg hover:bg-gray-400 transition dark:text-gray-200 dark:bg-orange-500 dark:hover:bg-orange-700"
                                                title="Ver usuario"
                                            >
                                                <FontAwesomeIcon icon={faEye} className="" />
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
                        className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-200 dark:bg-cyan-950 dark:disabled:opacity-70 dark:enabled:opacity-100"
                    >
                        Anterior
                    </button>
                    <span className="text-lg dark:text-gray-200">
                        Pagina {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
                    </span>
                    <button
                        disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-200 dark:bg-cyan-900 dark:disabled:opacity-70 dark:enabled:opacity-100"
                    >
                        Siguiente
                    </button>
                </div>

                {editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-800">
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
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-800">
                            <h2 className="text-xl font-bold mb-4 dark:text-white">Agregar Usuario</h2>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-300">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newUser.name}
                                        onChange={handleNewUserChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-300">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newUser.email}
                                        onChange={handleNewUserChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-300">Contraseña</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={newUser.password}
                                        onChange={handleNewUserChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
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
                                    <label className="text-gray-700 dark:text-gray-300">Activo</label>
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
