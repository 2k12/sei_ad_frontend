import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import EditUserForm from "../components/EditUserForm";
import ReportModalForm from "../components/ReportModalForm";
import ModalFastChargeUsers from "../components/ModalFastChargeUsers";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faEye, faFolder } from "@fortawesome/free-solid-svg-icons";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons/faToggleOn";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons/faToggleOff";
import { faDatabase } from "@fortawesome/free-solid-svg-icons/faDatabase";
import '../assets/styles.css';

const UsersPage = () => {
    const { users, fetchUsers, updateUser, createUser, loading, pagination } = useUsers();
    const [filters, setFilters] = useState({ email: "", active: "" });
    const [modalfastcharge, setShowModalFastChargeUsers] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [addingUser, setAddingUser] = useState(false);
    const [modalreport, setShowModalReport] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", active: true });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers({ page: pagination.page, pageSize: pagination.limit });
    }, [pagination.page, pagination.limit]);

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

    const handleCloseModalFastCharge = () => {
        setShowModalFastChargeUsers(false);
        fetchUsers({ page: pagination.page, pageSize: pagination.limit }); // Actualiza la lista de usuarios
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="main-container">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="header-title">
                        Gestión de Usuarios
                    </h1>
                    <div className="header-actions">
                        <button
                            onClick={() => setAddingUser(true)}
                            className="btn-Add"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Agregar Usuario
                        </button>
                        <div>
                            <button
                                className="btn-Charge"
                                onClick={() => setShowModalFastChargeUsers(true)}
                            >
                                <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                                Carga Rápida
                            </button>
                            {modalfastcharge && (
                                <ModalFastChargeUsers
                                    onClose={handleCloseModalFastCharge} // Cierra el modal y actualiza la tabla
                                    fetchUsers={fetchUsers} // Asegúrate de pasar fetchUsers aquí
                                />
                            )}
                        </div>
                        <div>
                            <button
                                className="btn-Report"
                                onClick={() => setShowModalReport(true)}
                            >
                                <FontAwesomeIcon icon={faFolder} className="mr-2" />
                                Reportes
                            </button>
                            {modalreport && <ReportModalForm onClose={() => setShowModalReport(false)} />}
                        </div>
                    </div>
                </div>
                <div className="filter-container">
                    <input
                        name="email"
                        value={filters.email}
                        onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
                        placeholder="Buscar por correo electrónico"
                        className="filter-input"
                    />
                    <select
                        name="active"
                        value={filters.active}
                        onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">Todo</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="btn-Search"
                    >
                        Buscar
                    </button>
                </div>
                <div className="mb-4 text-right">
                    <span className="text-lg text-gray-500 dark:text-gray-500">
                        Total de registros: {pagination.total}
                    </span>
                </div>
                
                {/* Tabla */}
                <div className="table-container">
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th className="table-row-header">Nombre</th>
                                <th className="table-row-header">Email</th>
                                <th className="table-row-header">Estado</th>
                                <th className="table-row-header">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">Loading...</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="table-row">
                                        <td className="table-cell">👤 {user.name}</td>
                                        <td className="table-cell">{user.email}</td>
                                        <td className="table-cell">{user.active ? (
                                                <span className="label-active">
                                                Activo
                                                </span>
                                            ) : (
                                                <span className="label-inactive">
                                                Inactivo
                                                </span>
                                            )}</td>
                                        <td className="px-6 py-3 flex items-center gap-2">
                                            
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="btn btn-icon"
                                                title="Editar usuario"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="" />

                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(user.id, user.active)}
                                                className="btn btn-icon-toggle"
                                                title={user.active ? "Desactivar Usuario" : "Activar Usuario"}
                                            >
                                                <FontAwesomeIcon icon={user.active ? faToggleOn : faToggleOff} className="btn-icon-active" />

                                            </button>
                                            <button
                                                onClick={() => navigate(`/users/${user.id}`, { state: { user } })}
                                                className="btn btn-icon"
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

                <div className="pagination-container">
                    <button
                        disabled={pagination.page === 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="pagination-button"
                    >
                        Anterior
                    </button>
                    <span className="text-lg dark:text-gray-200">
                        Pagina {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
                    </span>
                    <button
                        disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="pagination-button"
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
