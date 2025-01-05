import { useState, useEffect } from "react";
import { moduleApi } from "../api/axios"; // Asegúrate de tener una API para obtener los módulos

const CreatePermissionForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        module_id: "",
        active: true,
    });
    const [modules, setModules] = useState([]);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const { data } = await moduleApi.getModules();
                setModules(data);
            } catch (error) {
                console.error("Error fetching modules:", error);
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
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Descripción</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Módulo</label>
                <select
                    name="module_id"
                    value={formData.module_id}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                >
                    <option value="" disabled>Selecciona un módulo</option>
                    {modules.map((module) => (
                        <option key={module.id} value={module.id}>
                            {module.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
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

export default CreatePermissionForm;