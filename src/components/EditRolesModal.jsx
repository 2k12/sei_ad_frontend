import React, { useState, useEffect } from "react";
import { role_UserApi } from "../api/axios"; // Asegúrate de importar la API correctamente
import { toast } from "react-toastify";

const EditRolesModal = ({ onClose, currentRoles = [], userId, onSave }) => {
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState(
    currentRoles.map((role) => role.id)
  );

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await role_UserApi.getRolesActive();
        console.log("API response:", response.data.roles);
        if (response.data && Array.isArray(response.data.roles)) {
          setAvailableRoles(response.data.roles);
        } else {
          throw new Error("La estructura de los datos no es válida.");
        }
      } catch (error) {
        console.error("Error al cargar los roles:", error);
        toast.error("Hubo un error al cargar los roles.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);
  console.log("availableRoles", availableRoles);
  const toggleRoleSelection = (roleId) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(roleId)
        ? prevSelectedRoles.filter((id) => id !== roleId)
        : [...prevSelectedRoles, roleId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const rolesToAdd = selectedRoles.filter(
        (roleId) => !currentRoles.some((role) => role.id === roleId)
      );

      const rolesToRemove = currentRoles
        .filter((role) => !selectedRoles.includes(role.id))
        .map((role) => role.id);

      for (const roleId of rolesToAdd) {
        await role_UserApi.assignRoleToUser(userId, roleId);
      }

      for (const roleId of rolesToRemove) {
        await role_UserApi.removeRoleFromUser(userId, roleId);
      }

      toast.success("Los roles se actualizaron correctamente.");
      onSave(availableRoles.filter((role) => selectedRoles.includes(role.id)));
      onClose();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      toast.error("Hubo un error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Editar Roles
        </h2>
        {loading && (
          <p className="text-center text-gray-500">Cargando roles...</p>
        )}
        {!loading && !error && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {availableRoles.map((role) => (
              <div
                key={role.id}
                className={`p-4 rounded-lg shadow-md transition border-2 cursor-pointer ${
                  selectedRoles.includes(role.id)
                    ? "bg-green-200 border-green-500"
                    : "bg-gray-200 border-gray-300"
                }`}
                onClick={() => toggleRoleSelection(role.id)}
              >
                <h3 className="text-lg font-semibold">{role.name}</h3>
                <p>{role.description || "Sin descripción"}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="px-5 py-2 bg-gray-500 text-white rounded-lg"
            onClick={onClose}
            disabled={saving}
          >
            Cerrar
          </button>
          <button
            className="px-5 py-2 bg-blue-500 text-white rounded-lg"
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
