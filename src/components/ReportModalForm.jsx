import { useState } from "react";
import { reportApi } from "../api/axios"; // Asegúrate de que este archivo esté configurado correctamente
import { toast } from 'react-toastify';

const ReportModal = ({ onClose }) => {
    const [filters, setFilters] = useState({ active: null, module_key: null }); // Estado para manejar los filtros

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        // Actualiza el estado de los filtros según el checkbox seleccionado
        setFilters({
            ...filters,
            active: checked ? (name === "active" ? true : false) : null,
        });
    };

    const handleDropdownChange = (e) => {
        const { value } = e.target;
        setFilters({
            ...filters,
            module_key: value !== "" ? value : null, // Actualiza el filtro module_key
        });
    };

    const handleSubmit = async () => {
        try {
            // Payload a enviar a la API
            const payload = {
                model: "User",
                filters: {
                    ...(filters.active !== null && { active: filters.active }),
                    ...(filters.module_key && { module_key: filters.module_key }),
                },
            };

            // Llama a la función `generateReport` de `reportApi`
            const response = await reportApi.generateReport(payload);

            if (response.status === 200) {
                // Crea un Blob a partir de la respuesta.
                const blob = new Blob([response.data], { type: "application/pdf" });

                // Verifica si el Blob es válido.
                if (!(blob instanceof Blob)) {
                    throw new Error("La respuesta no es un Blob válido.");
                }

                // Genera la URL para la descarga del archivo.
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "reporte.pdf"; // Nombre del archivo.
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                toast.success("Reporte generado exitosamente.");
                onClose(); // Cierra el modal si es necesario.
            } else {
                console.error("Error al generar el reporte:", response.statusText);
                toast.error("No se pudo generar el reporte.");
            }
        } catch (error) {
            console.error("Error durante la solicitud:", error);
            toast.error("Hubo un problema al generar el reporte.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Generar Reporte</h2>
                <div className="mb-4 space-y-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="active"
                            checked={filters.active === true}
                            onChange={handleCheckboxChange}
                            className="h-5 w-5"
                        />
                        <span>Activos</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="inactive"
                            checked={filters.active === false}
                            onChange={handleCheckboxChange}
                            className="h-5 w-5"
                        />
                        <span>Inactivos</span>
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Módulo</label>
                    <select
                        value={filters.module_key || ""}
                        onChange={handleDropdownChange}
                        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        <option value="">Seleccione un módulo</option>
                        <option value="INVM">INVM</option>
                        <option value="ARM">ARM</option>
                        <option value="BILM">BILM</option>
                        <option value="PURM">PURM</option>
                        <option value="SECM">SECM</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Generar
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
