import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../context/PermissionContext";
import Navbar from "../components/Navbar";
import EditPermissionForm from "../components/EditPermissionForm";
import CreatePermissionForm from "../components/CreatePermissionForm";
import { FaEdit, FaEye, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";

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
  const [creatingPermission, setCreatingPermission] = useState(false);
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
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Gestión de Permisos</h1>
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Lista de Permisos</h2>
            <button
              onClick={() => setCreatingPermission(true)}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
            >
              <FaPlus />
            </button>
          </div>
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm text-gray-600">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">Nombre</th>
                    <th className="px-6 py-3 text-left">Descripción</th>
                    <th className="px-6 py-3 text-left">Estado</th>
                    <th className="px-6 py-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-100">
                      <td className="px-6 py-3">{permission.name}</td>
                      <td className="px-6 py-3">{permission.description}</td>
                      <td className="px-6 py-3">{permission.active ? 'Activo' : 'Inactivo'}</td>
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() => handleEditPermission(permission)}
                          className="px-4 py-2 bg-gray-200 text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleToggleActive(permission)}
                          className={`px-4 py-2 font-semibold rounded-lg shadow-md transition ${permission.active ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                        >
                          {permission.active ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <button
                          onClick={() => handleViewPermission(permission)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700"
          >
            Anterior
          </button>
          <span className="text-lg text-gray-800">
            Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
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
        {editingPermission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
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
            <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
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
