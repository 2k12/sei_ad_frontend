import React, { useState, useEffect } from "react";
import { role_UserApi } from "../api/axios"; // Asegúrate de importar la API correctamente

const EditRolesModal = ({ onClose, currentRoles = [], userId, onSave }) => {
    const [availableRoles, setAvailableRoles] = useState([]); // Para almacenar los roles disponibles
    const [loading, setLoading] = useState(true); // Para manejar el estado de carga
    const [saving, setSaving] = useState(false); // Estado de guardado
    const [error, setError] = useState(null); // Manejo de errores
    const [selectedRoles, setSelectedRoles] = useState(
        currentRoles.map((role) => role.id) // Extraemos los IDs de los roles asignados
    );

    // Obtener los roles disponibles desde el backend
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                setError(null); // Resetea el estado de error
                const response = await role_UserApi.getRoles(); // Llama al endpoint para obtener los roles

                // Si la respuesta contiene un objeto con "roles", asegúrate de acceder a esa clave
                if (response.data && Array.isArray(response.data.roles)) {
                    setAvailableRoles(response.data.roles); // Asegúrate de usar la estructura correcta
                } else {
                    console.error("La estructura de los datos no es válida.");
                    setError("No se pudo cargar la lista de roles. Verifica la estructura de la respuesta.");
                }
            } catch (error) {
                console.error("Error al cargar los roles:", error);
                setError("Hubo un error al cargar los roles. Intenta nuevamente.");
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };
        fetchRoles();
    }, []);

    // Función para manejar la selección/deselección de roles
    const toggleRoleSelection = (roleId) => {
        setSelectedRoles((prevSelectedRoles) =>
            prevSelectedRoles.includes(roleId)
                ? prevSelectedRoles.filter((id) => id !== roleId) // Deseleccionar
                : [...prevSelectedRoles, roleId] // Seleccionar
        );
    };

    // Guardar cambios
    const handleSave = async () => {
        setSaving(true); // Indica que se está guardando
        try {
            const rolesToAdd = selectedRoles.filter(
                (roleId) => !currentRoles.some((role) => role.id === roleId) // Roles nuevos
            );

            const rolesToRemove = currentRoles
                .filter((role) => !selectedRoles.includes(role.id)) // Roles eliminados
                .map((role) => role.id);

            // Agregar roles
            for (const roleId of rolesToAdd) {
                await role_UserApi.assignRoleToUser(userId, roleId);
            }

            // Eliminar roles
            for (const roleId of rolesToRemove) {
                await role_UserApi.removeRoleFromUser(userId, roleId);
            }

            // Notificar cambios al componente padre
            onSave(
                availableRoles.filter((role) => selectedRoles.includes(role.id))
            );
            onClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            alert("Hubo un error al guardar los cambios. Intenta nuevamente.");
        } finally {
            setSaving(false); // Finaliza el guardado
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Editar Roles
        </h2>

        {/* Mensajes de estado */}
        {loading && <p className="text-center text-gray-500">Cargando roles...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {availableRoles.length > 0 ? (
                    availableRoles.map((role) => (
                        <div
                            key={role.id}
                            className={`p-4 rounded-lg shadow-md transition border-2 cursor-pointer ${
                                selectedRoles.includes(role.id)
                                    ? "bg-green-200 border-green-500 text-green-900 dark:bg-green-700 dark:border-green-600"
                                    : "bg-gray-200 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                            } hover:shadow-lg`}
                            onClick={() => toggleRoleSelection(role.id)} // Cambia el estado del rol al hacer clic
                        >
                            <h3 className="text-lg font-semibold">{role.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {role.description || "Sin descripción"}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-300 col-span-full text-center">
                        No hay roles disponibles.
                    </p>
                )}
            </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
            <button
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                onClick={onClose}
                disabled={saving}
            >
                Cerrar
            </button>
            <button
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={handleSave}
                disabled={saving}
            >
                {saving ? "Guardando..." : "Guardar"}
            </button>
        </div>
    </div>
</div>

    );
};

export default EditRolesModal;

