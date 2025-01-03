import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "../context/RoleContext";
import Navbar from "../components/Navbar";
import EditRoleForm from "../components/EditRoleForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlus,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

const RolesPage = () => {
  const {
    roles,
    fetchRoles,
    updateRole,
    createRole,
    updateRoleState,
    loading,
    pagination,
  } = useRoles();
  const [filters, setFilters] = useState({ name: "", active: "" });
  const [editingRole, setEditingRole] = useState(null);
  const [addingRole, setAddingRole] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    active: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles({
      page: pagination.page,
      pageSize: pagination.limit,
      ...filters,
    });
  }, [pagination.page, pagination.limit, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
  };

  const handleSaveRole = (id, updatedData) => {
    updateRole(id, updatedData);
    setEditingRole(null);
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
  };

  const handleAddRole = () => {
    createRole(newRole);
    setAddingRole(false);
    setNewRole({ name: "", description: "", active: true });
  };

  const handleNewRoleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRole({ ...newRole, [name]: type === "checkbox" ? checked : value });
  };

  const handleToggleActive = (id, active) => {
    updateRoleState(id, !active); // Invierte el estado actual y lo actualiza
  };

  const handlePageChange = (newPage) => {
    fetchRoles({ page: newPage, pageSize: pagination.limit, ...filters });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Gestión de Roles
          </h1>
          <button
            onClick={() => setAddingRole(true)}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Agregar Rol
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Buscar por nombre"
            className="w-full md:w-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
          />
          <select
            name="active"
            value={filters.active}
            onChange={handleFilterChange}
            className="w-full md:w-48 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="table-auto w-full text-sm text-gray-600">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">Nombre del Rol</th>
                <th className="px-6 py-3 text-left">Descripción</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Cargando...
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-100">
                    <td className="px-6 py-3">{role.name}</td>
                    <td className="px-6 py-3">{role.description}</td>
                    <td className="px-6 py-3">
                      {role.active ? (
                        <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 flex items-center gap-2">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="px-3 py-2 bg-gray-200 text-blue-500 rounded-lg hover:bg-gray-400 transition"
                        title={"Editar Rol"} 
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-0" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(role.id, role.active)}
                        className="px-3 py-2 bg-gray-200 text-orange-400 rounded-lg hover:bg-gray-400 transition"
                        title={role.active ? "Desactivar Rol" : "Activar Rol"}
                      >
                        <FontAwesomeIcon
                          icon={faArrowsRotate}
                          className="mr-0"
                        />
                      </button>
                      {/* <button
                        onClick={() => handleDelete(role.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-0" />
                      </button> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="mt-6 flex justify-between items-center">
          <button
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700"
          >
            Anterior
          </button>
          <span className="text-lg">
            Página {pagination.page} de{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            disabled={
              pagination.page === Math.ceil(pagination.total / pagination.limit)
            }
            onClick={() => handlePageChange(pagination.page + 1)}
            className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700"
          >
            Siguiente
          </button>
        </div>

        {/* Formulario de edición */}
        {editingRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <EditRoleForm
                role={editingRole}
                onSave={handleSaveRole}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>
        )}

        {/* Formulario de creación */}
        {addingRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Agregar Rol</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddRole();
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={newRole.name}
                    onChange={handleNewRoleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Descripción</label>
                  <textarea
                    name="description"
                    value={newRole.description}
                    onChange={handleNewRoleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setAddingRole(false)}
                    className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
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

export default RolesPage;
