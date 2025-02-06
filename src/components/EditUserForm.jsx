import { useState, useEffect } from "react";
import { role_UserApi } from "../api/axios"; // API para obtener roles
import { userApi } from "../api/axios"; // API para actualizar usuario
import { toast } from "react-toastify";

const EditUserForm = ({ user, onSave, onCancel }) => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const userId = decodedToken.id || 1; 
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    active: user.active || false,
  });

  const [availableRoles, setAvailableRoles] = useState([]); // Roles disponibles
  const [selectedRoles, setSelectedRoles] = useState(user.roles?.map((role) => role.id) || []); // Roles seleccionados

  useEffect(() => {
    // Cargar roles disponibles desde la API
    const fetchRoles = async () => {
      try {
        const response = await role_UserApi.getRolesActive();
        if (response.data && Array.isArray(response.data.roles)) {
          setAvailableRoles(response.data.roles);
        } else {
          throw new Error("Error al cargar los roles disponibles.");
        }
      } catch (error) {
        console.error("Error al cargar los roles:", error);
        toast.error("No se pudieron cargar los roles disponibles.");
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const toggleRoleSelection = (roleId) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(roleId)
        ? prevSelectedRoles.filter((id) => id !== roleId) // Quitar rol
        : [...prevSelectedRoles, roleId] // Agregar rol
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await userApi.updateUser(user.id, formData); // Cambiar role_UserApi a userApi
      // Identificar roles a agregar y roles a eliminar
      const rolesToAdd = selectedRoles.filter(
        (roleId) => !user.roles.some((role) => role.id === roleId)
      );

      const rolesToRemove = user.roles
        .filter((role) => !selectedRoles.includes(role.id))
        .map((role) => role.id);

      // Agregar roles nuevos
      for (const roleId of rolesToAdd) {
        if (!user.id) {
          console.error("Error: El usuario no tiene un ID válido.");
          return;
        }
        await role_UserApi.assignRoleToUser(user.id, roleId);
      }

      // Eliminar roles no seleccionados
      for (const roleId of rolesToRemove) {
        await role_UserApi.removeRoleFromUser(user.id, roleId);
      }

      toast.success("Los roles se actualizaron correctamente.");
      onSave({ ...formData, roles: selectedRoles }); // Enviar datos actualizados
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar roles:", error);
      toast.error("Hubo un error al guardar los cambios.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-400 dark:text-white">Usuario</h2>
        <div className="bg-gray-200 text-gray-600 text-xs font-semibold py-1 px-3 rounded-full">
          FC: {new Date(user.created_at).toLocaleDateString()}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-gray-400">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full text-gray-400 dark:bg-gray-700"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-gray-400">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full text-gray-400 dark:bg-gray-700"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-gray-400">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="mr-2"
          />
          Activo
        </label>
      </div>

      {/* Sección de Roles */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-gray-400">Roles</label>
        <div className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700">
          {availableRoles.map((role) => (
            <div key={role.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedRoles.includes(role.id)} // Verifica si el rol está seleccionado
                onChange={() => toggleRoleSelection(role.id)}
                className="mr-2"
              />
              <label className="text-gray-400">{role.name}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
