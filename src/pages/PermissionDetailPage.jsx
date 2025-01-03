import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const PermissionDetailPage = () => {
  const location = useLocation();
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    const permissionFromState = location.state?.permission;
    if (permissionFromState) {
      setPermission(permissionFromState);
    } else {
      const permissionId = parseInt(location.pathname.split("/").pop(), 10);
      // Aquí deberías obtener el permiso desde tu contexto o API usando el ID
      // const selectedPermission = obtenerPermisoPorId(permissionId);
      // setPermission(selectedPermission);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-600">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
          Detalles del Permiso
        </h1>
        {permission ? (
          <div className="mb-6 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Información del Permiso
            </h2>
            <div className="space-y-4 text-gray-800">
              <div>
                <strong className="block text-sm font-medium text-gray-700 dark:text-white">Nombre</strong>
                <p>{permission.name}</p>
              </div>
              <div>
                <strong className="block text-sm font-medium text-gray-700 dark:text-white">Descripción</strong>
                <p>{permission.description}</p>
              </div>
              <div>
                <strong className="block text-sm font-medium text-gray-700 dark:text-white">Estado</strong>
                <p>{permission.active ? "Activo" : "Inactivo"}</p>
              </div>
              <div>
                <strong className="block text-sm font-medium text-gray-700 dark:text-white">Módulo</strong>
                <p>{permission.module.name}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">Cargando...</p>
        )}
      </div>
    </div>
  );
};

export default PermissionDetailPage;