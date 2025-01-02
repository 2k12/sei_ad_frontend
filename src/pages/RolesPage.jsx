import { useEffect, useState } from "react";
import { useRoles } from "../context/RoleContext";
import Navbar from "../components/Navbar";
import EditRoleForm from "../components/EditRoleForm";

const RolesPage = () => {
  const {
    roles,
    fetchRoles,
    updateRole,
    deleteRole,
    createRole,
    loading,
    pagination,
  } = useRoles();
  const [filters, setFilters] = useState({ name: "" });
  const [editingRole, setEditingRole] = useState(null); // Rol en edición
  const [isCreating, setIsCreating] = useState(false); // Estado para abrir el formulario de creación

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

  const handleDelete = (id) => {
    deleteRole(id);
  };

  const handlePageChange = (newPage) => {
    fetchRoles({ page: newPage, pageSize: pagination.limit, ...filters });
  };

  const handleCreateRole = (newRole) => {
    createRole(newRole); // Llama a la función para crear el rol
    setIsCreating(false); // Cierra el modal
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-blue-500">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-white mb-6">
          Gestión de Roles
        </h1>

        {/* Filtros y Botón para Crear */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Buscar por nombre"
            className="w-full md:w-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
          />
          <button
            onClick={() => setIsCreating(true)}
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
          >
            Crear Rol
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="table-auto w-full text-sm text-gray-600">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">Nombre del Rol</th>
                <th className="px-6 py-3 text-left">Estado</th>
                {/* Nueva columna */}
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
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="mr-3 px-4 py-2 bg-gray-500 text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 ease-in-out"
                      >
                        Eliminar
                      </button>
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
        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = e.target.name.value;
                  const description = e.target.description.value;
                  handleCreateRole({ name, description });
                }}
              >
                <h2 className="text-black text-lg font-bold mb-4">
                  Crear Nuevo Rol
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2 text-gray-400">
                    Nombre del Rol
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="border p-2 rounded w-full text-gray-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2 text-gray-400">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    className="border p-2 rounded w-full text-gray-400"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
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
