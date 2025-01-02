import { useState } from "react";

const EditRoleForm = ({ role, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: role.name || "",
    description: role.description || "",
    active: role.active || false, // Agregamos el estado inicial del rol
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(role.id, formData); // Guardar los cambios
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-400">Editar Rol</h2>
        <div className="bg-gray-200 text-gray-600 text-xs font-semibold py-1 px-3 rounded-full">
          ID: {role.id}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-gray-400">
          Nombre del Rol
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
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
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full text-gray-400"
          rows="3"
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center text-sm font-bold text-gray-400">
          <input
            type="checkbox"
            name="active"
            checked={formData.active} // Checkbox para cambiar el estado
            onChange={handleChange}
            className="mr-2"
          />
          Activo
        </label>
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

export default EditRoleForm;
