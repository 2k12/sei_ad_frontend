import { useEffect, useState } from "react";
import { useRoles } from "../context/RoleContext";
import Navbar from "../components/Navbar";
import EditRoleForm from "../components/EditRoleForm";
import { roleUserApi } from "../api/axios"; // API para roles y permisos

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
  const [editingRole, setEditingRole] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [assigningPermissions, setAssigningPermissions] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [confirmChanges, setConfirmChanges] = useState(false);
  const [changes, setChanges] = useState({ toAdd: [], toRemove: [] });

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
            if (!acc[moduleName]) {
              acc[moduleName] = [];
            }
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

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
  };

  const handleAssignPermissions = (role) => {
    setSelectedRole(role);
    setAssigningPermissions(true);
  };

  const handlePermissionChange = (permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const handleSavePermissions = () => {
    const currentPermissionIds = permissions.map((perm) => perm.id);
    const toAdd = selectedPermissions.filter(
      (id) => !currentPermissionIds.includes(id)
    );
    const toRemove = currentPermissionIds.filter(
      (id) => !selectedPermissions.includes(id)
    );

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
    createRole(newRole);
    setIsCreating(false);
  };

  const moduleColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-blue-500">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-white mb-6">
          Gestión de Roles
        </h1>

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

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="table-auto w-full text-sm text-gray-600">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">Nombre del Rol</th>
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
                        className="mr-3 px-4 py-2 bg-gray-500 text-blue-500 font-semibold rounded-lg"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleAssignPermissions(role)}
                        className="mr-3 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg"
                      >
                        Asignar
                      </button>
                      <button
                        onClick={() => deleteRole(role.id)}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg"
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
