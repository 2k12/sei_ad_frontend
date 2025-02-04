import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { moduleApi } from "../api/axios";

const CreatePermissionForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    module_id: "",
    active: true,
  });

  const [modules, setModules] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await moduleApi.getModules();
        setModules(response.data.modules || []);
        setIsLoadingModules(false);
      } catch (error) {
        setError("Error al cargar los módulos");
        setIsLoadingModules(false);
      }
    };
    fetchModules();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      module_id: parseInt(formData.module_id, 10),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow dark:bg-gray-800"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-400 dark:text-white">
          Nuevo Permiso
        </h2>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-gray-400">
          Nombre
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full text-gray-400 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-gray-400">
          Descripción
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full text-gray-400 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-gray-400">
          Módulo
        </label>
        <select
          name="module_id"
          value={formData.module_id}
          onChange={handleChange}
          className="border p-2 rounded w-full text-gray-400 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="" disabled>
            Selecciona un módulo
          </option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.name}
            </option>
          ))}
        </select>
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

      <div className="flex justify-end gap-2 mt-4">
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

CreatePermissionForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreatePermissionForm;
