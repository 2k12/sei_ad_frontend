import { useState, useEffect } from "react";
import { moduleApi } from "../api/axios";

const EditPermissionForm = ({ permission, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: permission.name,
        description: permission.description,
        module_id: permission.module_id,
        active: permission.active,
    });
    const [modules, setModules] = useState([]);
    const [isLoadingModules, setIsLoadingModules] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await moduleApi.getModules();
                const { modules } = response.data; // Extraer la propiedad 'modules' de la respuesta
                if (Array.isArray(modules)) {
                    setModules(modules);
                } else {
                    console.error("La propiedad 'modules' no es un arreglo:", modules);
                    setError('Formato de datos incorrecto');
                }
            } catch (error) {
                console.error("Error al cargar los módulos:", error);
                setError('Error al cargar los módulos');
            } finally {
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
        onSave(permission.id, {
            ...formData,
            module_id: parseInt(formData.module_id, 10),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-400 dark:text-white">Usuario</h2>
                <div className="bg-gray-200 text-gray-600 text-xs font-semibold py-1 px-3 rounded-full">
                FC: {new Date(permission.created_at).toLocaleDateString()}
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
                <label className="block text-sm font-bold mb-2 text-gray-400">Descripción</label>
                <input
                type="text"
                name="name"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded w-full text-gray-400 dark:bg-gray-700"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-gray-400">Módulo</label>
                <select
                    name="module_id"
                    value={formData.module_id}
                    onChange={handleChange}
                    className="border p-2 rounded w-full text-gray-400 dark:bg-gray-700"
                    required
                    disabled={isLoadingModules || error !== null}
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

export default EditPermissionForm;
