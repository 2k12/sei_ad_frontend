import { useState } from "react";
import PropTypes from "prop-types"; 

const EditRoleForm = ({ role, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: role.name || "",
    description: role.description || "",
    active: role.active || false,
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
    onSave(role.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow dark:bg-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-400 dark:text-white">Editar Rol</h2>
        <div className="bg-gray-200 text-gray-600 text-xs font-semibold py-1 px-3 rounded-full">
          ID: {role.id}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-bold mb-2 text-gray-400">
          Nombre del Rol
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full text-gray-400 dark:bg-gray-700"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-bold mb-2 text-gray-400">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full text-gray-400 dark:bg-gray-700"
          rows="3"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center text-sm font-bold text-gray-400">
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

EditRoleForm.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    active: PropTypes.bool.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditRoleForm;
