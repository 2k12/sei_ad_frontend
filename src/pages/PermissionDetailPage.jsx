import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { permissionApi } from "../api/axios"; // Importa la API de permisos

const PermissionDetailPage = () => {
    const location = useLocation();
    const [permission, setPermission] = useState(null);

    useEffect(() => {
        const permissionFromState = location.state?.permission;
        if (permissionFromState) {
            setPermission(permissionFromState);
        } else {
            const permissionId = parseInt(location.pathname.split("/").pop(), 10);
            fetchPermissionById(permissionId);
        }
    }, [location]);

    const fetchPermissionById = async (id) => {
        try {
            const { data } = await permissionApi.getPermissionById(id);
            console.log("Permission fetched:", data); // Verifica los datos obtenidos
            setPermission(data.permission);
        } catch (error) {
            console.error("Error fetching permission:", error);
        }
    };

    useEffect(() => {
        console.log("Permission state:", permission); // Verifica el estado del permiso
    }, [permission]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-slate-900">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-6 dark:text-white">
                    Detalles del Permiso
                </h1>
                {permission ? (
                    <div className="mb-6 bg-white p-6 rounded-lg shadow-md dark:bg-gray-900">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Información del Permiso
                        </h2>
                        <div className="space-y-4 text-gray-800">
                            <div>
                                <strong className="block text-sm font-medium text-gray-700 dark:text-white">Nombre</strong>
                                <p className="dark:text-gray-200">{permission.name}</p>
                            </div>
                            <div>
                                <strong className="block text-sm font-medium text-gray-700 dark:text-white">Descripción</strong>
                                <p className="dark:text-gray-200">{permission.description}</p>
                            </div>
                            <div>
                                <strong className="block text-sm font-medium text-gray-700 dark:text-white">Estado</strong>
                                <p className={permission.active ? "inline-block px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold dark:bg-green-300 dark:text-green-900" :
                                    "inline-block px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold dark:bg-red-300 dark:text-red-900"
                                }>{permission.active ? "Activo" : "Inactivo"}</p>
                            </div>
                            <div>
                                <strong className="block text-sm font-medium text-gray-700 dark:text-white">Módulo</strong>
                                <p className="dark:text-gray-200">{permission.module?.name || "No asignado"}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Cargando...</p>
                )}
            </div>
        </div>
    );
};

export default PermissionDetailPage;
