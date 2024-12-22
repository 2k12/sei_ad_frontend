import { useState } from "react";

const EditUserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    active: user.active || false,
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
    onSave(user.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-400">Usuario</h2>
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
          className="border p-2 rounded w-full text-gray-400"
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
          className="border p-2 rounded w-full text-gray-400"
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
            className="mr-2 text-gray-400"
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

export default EditUserForm;
