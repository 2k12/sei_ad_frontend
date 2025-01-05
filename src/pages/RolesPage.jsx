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
import { roleUserApi } from "../api/axios"; // API para roles y permisos

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

  const navigate = useNavigate();

  // Estados
  const [filters, setFilters] = useState({ name: "", active: "" });
  const [editingRole, setEditingRole] = useState(null);
  const [addingRole, setAddingRole] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    active: true,
  });
  const [assigningPermissions, setAssigningPermissions] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [confirmChanges, setConfirmChanges] = useState(false);
  const [changes, setChanges] = useState({ toAdd: [], toRemove: [] });

  // Hooks
  useEffect(() => {
    fetchRoles({
      page: pagination.page,
      pageSize: pagination.limit,
      ...filters,
    });
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    if (assigningPermissions && selectedRole) {
      const fetchPermissions = async () => {
        try {
          const response = await roleUserApi.getAllPermissions();
          setAllPermissions(response.data.permissions);

          const rolePermissions = await roleUserApi.getRolePermissions(
            selectedRole.id
          );
          setPermissions(rolePermissions.data.permissions || []);
          setSelectedPermissions(
            rolePermissions.data.permissions.map((perm) => perm.id)
          );

          const grouped = response.data.permissions.reduce((acc, perm) => {
            const moduleName = perm.module?.name || "Sin Módulo";
            if (!acc[moduleName]) acc[moduleName] = [];
            acc[moduleName].push(perm);
            return acc;
          }, {});
          setGroupedPermissions(grouped);
        } catch (error) {
          console.error("Error al cargar permisos:", error);
        }
      };
      fetchPermissions();
    }
  }, [assigningPermissions, selectedRole]);

  // Handlers
  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleEditRole = (role) => setEditingRole(role);

  const handleAssignPermissions = (role) => {
    setSelectedRole(role);
    setAssigningPermissions(true);
  };

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = () => {
    const currentPermissionIds = permissions.map((perm) => perm.id);
    const toAdd = selectedPermissions.filter((id) => !currentPermissionIds.includes(id));
    const toRemove = currentPermissionIds.filter((id) => !selectedPermissions.includes(id));

    setChanges({ toAdd, toRemove });
    setConfirmChanges(true);
  };

  const confirmSave = async () => {
    try {
      for (const permissionId of changes.toAdd) {
        await roleUserApi.assignPermission(selectedRole.id, permissionId);
      }
      for (const permissionId of changes.toRemove) {
        await roleUserApi.removePermission(selectedRole.id, permissionId);
      }

      setPermissions(
        allPermissions.filter((perm) => selectedPermissions.includes(perm.id))
      );
      setAssigningPermissions(false);
      setConfirmChanges(false);
    } catch (error) {
      console.error("Error al guardar permisos:", error);
    }
  };

  const handleCancelAssign = () => {
    setAssigningPermissions(false);
    setSelectedRole(null);
  };

  const handleSaveRole = (id, updatedData) => {
    updateRole(id, updatedData);
    setEditingRole(null);
  };

  const handleCancelEdit = () => setEditingRole(null);

  const handleAddRole = () => {
    createRole(newRole);
    setAddingRole(false);
    setNewRole({ name: "", description: "", active: true });
  };

  const handleNewRoleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRole({ ...newRole, [name]: type === "checkbox" ? checked : value });
  };

  const handleToggleActive = (id, active) => updateRoleState(id, !active);

  const handlePageChange = (newPage) => fetchRoles({ page: newPage, pageSize: pagination.limit, ...filters });

  const moduleColors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];

  return (
    <div className="min-h-screen bg-gray-100">
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
                  <td colSpan="4" className="text-center py-4">
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
                        title="Editar Rol"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(role.id, role.active)}
                        className="px-3 py-2 bg-gray-200 text-orange-400 rounded-lg hover:bg-gray-400 transition"
                        title={role.active ? "Desactivar Rol" : "Activar Rol"}
                      >
                        <FontAwesomeIcon icon={faArrowsRotate} />
                      </button>
                      <button
                        onClick={() => handleAssignPermissions(role)}
                        className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                        title="Asignar Permisos"
                      >
                        Asignar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modales */}
        {assigningPermissions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full max-w-5xl overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Asignar Permisos</h2>
              {Object.keys(groupedPermissions).map((moduleName, index) => (
                <div
                  key={moduleName}
                  className={`p-4 rounded-lg shadow-md ${moduleColors[index % moduleColors.length]} text-white mb-4`}
                >
                  <h3 className="text-lg font-semibold mb-2">{moduleName}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {groupedPermissions[moduleName].map((permission) => (
                      <div
                        key={permission.id}
                        className="bg-gray-800 p-2 rounded-md flex items-center justify-between"
                      >
                        <span>{permission.name}</span>
                        <input
                          type="checkbox"
                          className="accent-green-500"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handlePermissionChange(permission.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  onClick={handleCancelAssign}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={handleSavePermissions}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmChanges && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Confirmar Cambios</h2>
              <div>
                {changes.toAdd.length > 0 && (
                  <>
                    <p className="mb-2">Permisos a agregar:</p>
                    <ul className="mb-4">
                      {changes.toAdd.map((id) => {
                        const permission = allPermissions.find(
                          (perm) => perm.id === id
                        );
                        return <li key={id}>- {permission?.name}</li>;
                      })}
                    </ul>
                  </>
                )}
                {changes.toRemove.length > 0 && (
                  <>
                    <p className="mb-2">Permisos a eliminar:</p>
                    <ul className="mb-4">
                      {changes.toRemove.map((id) => {
                        const permission = allPermissions.find(
                          (perm) => perm.id === id
                        );
                        return <li key={id}>- {permission?.name}</li>;
                      })}
                    </ul>
                  </>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  onClick={() => setConfirmChanges(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={confirmSave}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

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

        {/* Modal de agregar rol */}
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
