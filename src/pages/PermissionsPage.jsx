import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../context/PermissionContext";
import Navbar from "../components/Navbar";
import EditPermissionForm from "../components/EditPermissionForm";
import CreatePermissionForm from "../components/CreatePermissionForm"; // Importa el nuevo componente
import {
  faAddressCard,
  faEdit,
  faExchange,
  faEye,
  faPlug,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons/faToggleOn";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons/faToggleOff";

const PermissionsPage = () => {
  const {
    permissions,
    fetchPermissions,
    createPermission,
    updatePermission,
    loading,
    pagination,
    setPagination,
  } = usePermissions();
  const [editingPermission, setEditingPermission] = useState(null);
  const [creatingPermission, setCreatingPermission] = useState(false); // Estado para el modal de creación
  const navigate = useNavigate();

  useEffect(() => {
    fetchPermissions(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);

  const handleEditPermission = (permission) => {
    setEditingPermission(permission);
  };

  const handleSavePermission = (id, updatedData) => {
    updatePermission(id, updatedData);
    setEditingPermission(null);
  };

  const handleCancelEdit = () => {
    setEditingPermission(null);
  };

  const handleCreatePermission = (permissionData) => {
    createPermission(permissionData);
    setCreatingPermission(false);
  };

  const handleToggleActive = (permission) => {
    updatePermission(permission.id, {
      ...permission,
      active: !permission.active,
    });
  };

  const handleViewPermission = (permission) => {
    navigate(`/permissions/${permission.id}`, { state: { permission } });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
            Gestión de Permisos
          </h1>
          <button
            onClick={() => setCreatingPermission(true)}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition dark:bg-green-700 dark:hover:bg-green-900"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Agregar Permiso
          </button>
        </div>
        {/* Tabla */}
        <div className="mb-4 text-right">
          <span className="text-lg text-gray-500 dark:text-gray-500">
            Total de registros: {pagination.total}
          </span>
        </div>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="table-auto w-full text-sm text-gray-600 dark:bg-cyan-950 dark:text-gray-200">
            <thead className="bg-gray-200 dark:bg-cyan-800 dark:text-white">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
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
                permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-100 dark:hover:bg-cyan-900">
                    <td className="px-6 py-3"><FontAwesomeIcon icon={faAddressCard} className="mr-5"/>{permission.name}</td>
                    <td className="px-6 py-3">{permission.description}</td>
                    <td className="px-6 py-3">
                      {permission.active ? (
                        <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold dark:bg-green-300 dark:text-green-900">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold dark:bg-red-300 dark:text-red-900">
                          Inactivo
                        </span>
                      )}
                    </td>
                    {/* Mostrar el estado */}
                    <td className="px-6 py-3 flex items-center gap-2">
                      <button
                        onClick={() => handleViewPermission(permission)}
                        className="mr-3 px-4 py-2 bg-gray-200 text-green-500 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out dark:text-gray-200 dark:bg-green-800 dark:hover:bg-green-500"
                      >
                        <FontAwesomeIcon icon={faEye} className="" />
                      </button>
                      <button
                        onClick={() => handleEditPermission(permission)}
                        className="mr-3 px-4 py-2 bg-gray-200 text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out dark:text-gray-200 dark:bg-blue-800 dark:hover:bg-blue-500"
                      >
                        <FontAwesomeIcon icon={faEdit} className="" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(permission)}
                        className="mr-3 px-4 py-2 bg-gray-200 text-orange-500 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out dark:bg-gray-300 dark:hover:bg-gray-400"
                        title={
                          permission.active ? "Desactivar Rol" : "Activar Rol"
                        }
                      >
                        <FontAwesomeIcon icon={permission.active ? faToggleOn : faToggleOff} className={permission.active ? "text-green-800" : "text-red-800"} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-200 dark:bg-cyan-950 dark:disabled:opacity-70 dark:enabled:opacity-100"
          >
            Anterior
          </button>
          <span className="text-lg text-gray-800 dark:text-white">
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
        {editingPermission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-800">
              <EditPermissionForm
                permission={editingPermission}
                onSave={handleSavePermission}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>
        )}
        {creatingPermission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-800">
              <CreatePermissionForm
                onSave={handleCreatePermission}
                onCancel={() => setCreatingPermission(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionsPage;
