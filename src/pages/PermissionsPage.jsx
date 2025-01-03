import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../context/PermissionContext";
import Navbar from "../components/Navbar";
import EditPermissionForm from "../components/EditPermissionForm";
import CreatePermissionForm from "../components/CreatePermissionForm"; // Importa el nuevo componente
import { FaEdit, FaEye, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa"; // Importa los iconos

const PermissionsPage = () => {
  const { permissions, fetchPermissions, createPermission, updatePermission, loading } = usePermissions();
  const [editingPermission, setEditingPermission] = useState(null);
  const [creatingPermission, setCreatingPermission] = useState(false); // Estado para el modal de creación
  const navigate = useNavigate();

  useEffect(() => {
    fetchPermissions();
  }, []);

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
    updatePermission(permission.id, { ...permission, active: !permission.active });
  };

  const handleViewPermission = (permission) => {
    navigate(`/permissions/${permission.id}`, { state: { permission } });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-600">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">Gestión de Permisos</h1>
        <div className="mb-6 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Lista de Permisos</h2>
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm text-gray-600">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">Nombre</th>
                    <th className="px-6 py-3 text-left">Descripción</th>
                    <th className="px-6 py-3 text-left">Estado</th> {/* Nueva columna para el estado */}
                    <th className="px-6 py-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-100">
                      <td className="px-6 py-3">{permission.name}</td>
                      <td className="px-6 py-3">{permission.description}</td>
                      <td className="px-6 py-3">{permission.active ? 'Activo' : 'Inactivo'}</td> {/* Mostrar el estado */}
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() => handleEditPermission(permission)}
                          className="px-4 py-2 bg-gray-200 text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
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
                          className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => setCreatingPermission(true)}
                          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                        >
                          <FaPlus />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {editingPermission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
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
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
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