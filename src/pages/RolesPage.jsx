import { useEffect, useState } from "react";
import { useRoles } from "../context/RoleContext";
import Navbar from "../components/Navbar";
import EditRoleForm from "../components/EditRoleForm";
import ReportModalRolesForm from "../components/ReportModalRolesForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faUserPlus, faAddressBook } from "@fortawesome/free-solid-svg-icons";
import { roleUserApi } from "../api/axios";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons/faToggleOn";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons/faToggleOff";
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";

const RolesPage = () => {
  const { roles, fetchRoles, updateRole, createRole, updateRoleState, loading, pagination,} = useRoles();
  // Operaciones
  const [filters, setFilters] = useState({ name: "", active: "" });
  const [editingRole, setEditingRole] = useState(null);
  const [addingRole, setAddingRole] = useState(false);
  const [modalreport, setShowModalReportRoles] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "", active: true });
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
    });
  }, [pagination.page, pagination.limit]);

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
  const handleSearch = () => {
    fetchRoles({ page: pagination.page, pageSize: pagination.limit, ...filters });
};

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

  const moduleColors = [ "bg-gray-100 dark:bg-gray-600"];
  const moduleColorsPer = ["bg-gray-200 dark:bg-gray-700"];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="mb-6 text-3xl font-semibold text-gray-800 dark:text-gray-200">
              Gestión de Roles
          </h1>
          <div className="mb-6 flex justify-end items-center">
            <button
              onClick={() => setAddingRole(true)}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition dark:bg-green-700 dark:hover:bg-green-900 mr-2"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar Rol
            </button>
            <div>
              <button
              className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
              onClick={() => setShowModalReportRoles(true)}
              >
                <FontAwesomeIcon icon={faFolder} className="mr-2" />
                Reportes
              </button>
              { modalreport && <ReportModalRolesForm onClose={() => setShowModalReportRoles(false)} />}
            </div>
        </div>
      </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            name="name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
            placeholder="Buscar por nombre"
            className="w-full md:w-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 dark:border-gray-500 dark:bg-gray-800"
          />
          <select
            name="active"
            value={filters.active}
            onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
            className="w-full md:w-48 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 dark:border-gray-500 dark:bg-gray-800"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-900">
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
                  <tr key={role.id} className="hover:bg-gray-100 dark:hover:bg-cyan-900">
                    <td className="px-6 py-3"><FontAwesomeIcon icon={faAddressBook} className="mr-5"/>{role.name}</td>
                    <td className="px-6 py-3">{role.description}</td>
                    <td className="px-6 py-3">
                      {role.active ? (
                        <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold dark:bg-green-300 dark:text-green-900">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold dark:bg-red-300 dark:text-red-900">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 flex items-center gap-2">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="px-3 py-2 bg-gray-200 text-blue-500 rounded-lg hover:bg-gray-400 transition dark:text-gray-200 dark:bg-blue-800 dark:hover:bg-blue-500"
                        title="Editar Rol"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(role.id, role.active)}
                        className="px-3 py-2 bg-gray-200 text-orange-500 rounded-lg hover:bg-gray-400 transition dark:bg-gray-300 dark:hover:bg-gray-400"
                        title={role.active ? "Desactivar Rol" : "Activar Rol"}
                      >
                        <FontAwesomeIcon icon={role.active ? faToggleOn : faToggleOff} className={role.active ? "text-green-800" : "text-red-800"} />
                      </button>
                      <button
                        onClick={() => handleAssignPermissions(role)}
                        className="px-3 py-2 bg-gray-200 text-green-500 rounded-lg hover:bg-yellow-600 transition dark:text-white dark:bg-orange-500 dark:hover:bg-orange-700"
                        title="Asignar Permisos"
                      >
                        <FontAwesomeIcon icon={faUserPlus} className=""/>
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
            className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-200 dark:bg-cyan-950 dark:disabled:opacity-70 dark:enabled:opacity-100"
          >
            Anterior
          </button>
          <span className="text-lg dark:text-gray-200">
            Página {pagination.page} de{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            disabled={
              pagination.page === Math.ceil(pagination.total / pagination.limit)
            }
            onClick={() => handlePageChange(pagination.page + 1)}
            className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-200 dark:bg-cyan-900 dark:disabled:opacity-70 dark:enabled:opacity-100"
          >
            Siguiente
          </button>
        </div>

        {/* Modales */}
        {assigningPermissions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 sm:p-6">
            <div className="bg-gray-200 text-gray-800 p-6 dark:bg-slate-700 rounded-lg shadow-lg w-full max-w-2xl sm:max-w-4xl lg:max-w-5xl overflow-y-auto max-h-full">
              <h2 className="text-2xl font-semibold mb-4 text-center dark:text-white">Asignar Permisos</h2>
              {Object.keys(groupedPermissions).map((moduleName, index) => (
                <div
                  key={moduleName}
                  className={`p-4 rounded-lg shadow-md ${moduleColors[index % moduleColors.length]
                    } text-gray-800 mb-4 dark:text-white`}
                >
                  <h3 className="text-lg font-semibold mb-2">{moduleName}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {groupedPermissions[moduleName].map((permission) => (
                      <div
                        key={permission.id}
                        moduleColorsPer
                        className={`p-2 rounded-md ${moduleColorsPer[index % moduleColorsPer.length]
                          } flex items-center justify-between`}

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
              <div className="flex justify-between sm:justify-end mt-4 flex-wrap gap-4">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  onClick={handleCancelAssign}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
            <div className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-700">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Confirmar Cambios</h2>
              <div>
                {changes.toAdd.length > 0 && (
                  <>
                    <p className="mb-2 text-black dark:text-white">Permisos a agregar:</p>
                    <ul className="mb-4 text-black dark:text-white">
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
                    <p className="mb-2 text-black dark:text-white">Permisos a eliminar:</p>
                    <ul className="mb-4 text-black dark:text-white">
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
              <div className="flex justify-between sm:justify-end mt-4 flex-wrap gap-4">
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
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-700">
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
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-700">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Agregar Rol</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddRole();
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-400">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={newRole.name}
                    onChange={handleNewRoleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:text-white dark:bg-gray-700"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-400">Descripción</label>
                  <textarea
                    name="description"
                    value={newRole.description}
                    onChange={handleNewRoleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:text-white dark:bg-gray-700"
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

export default RolesPage;
