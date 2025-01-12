import { useState } from "react";
import { reportApi } from "../api/axios"; // Asegúrate de que este archivo esté configurado correctamente
import { toast } from 'react-toastify';

const ReportModal = ({ onClose }) => {
    const [filters, setFilters] = useState({ active: null, module_key: null, format: "pdf" });
    const token = localStorage.getItem("token");
    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
    const userName = decodedToken.Name || "Nombre de usuario";

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        setFilters({
            ...filters,
            active: checked ? (name === "active" ? true : false) : null,
        });
    };

    const handleDropdownChange = (e) => {
        const { value } = e.target;
        setFilters({
            ...filters,
            module_key: value !== "" ? value : null,
        });
    };

    const handleFormatChange = (format) => {
        setFilters({
            ...filters,
            format,
        });
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                model: "User",
                filters: {
                    ...(filters.active !== null && { active: filters.active }),
                    ...(filters.module_key && { module_key: filters.module_key }),
                },
                format: filters.format,
                username: userName,
            };

            const response = await reportApi.generateReport(payload);

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: filters.format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filters.format === "pdf" ? "reporte.pdf" : "reporte.xlsx";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                toast.success("Reporte generado exitosamente.");
                onClose();
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-[400px] dark:bg-gray-900">
                <h2 className="text-2xl font-semibold mb-6 text-gray-600 dark:text-white dark:font-semibold text-center">
                    Generar Reporte
                </h2>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-800 mb-2 dark:text-gray-300">
                        Formato
                    </label>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleFormatChange("pdf")}
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                filters.format === "pdf"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                        >
                            PDF
                        </button>
                        <button
                            onClick={() => handleFormatChange("excel")}
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                filters.format === "excel"
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                        >
                            Excel
                        </button>
                    </div>
                </div>
                <div className="mb-6">
                    <label className="flex items-center space-x-4 cursor-pointer">
                        <input
                            type="checkbox"
                            name="active"
                            checked={filters.active === true}
                            onChange={handleCheckboxChange}
                            className="h-5 w-5 accent-blue-500 rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700"
                        />
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            Activos
                        </span>
                    </label>
                    <label className="flex items-center space-x-4 mt-4 cursor-pointer">
                        <input
                            type="checkbox"
                            name="inactive"
                            checked={filters.active === false}
                            onChange={handleCheckboxChange}
                            className="h-5 w-5 accent-blue-500 rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700"
                        />
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            Inactivos
                        </span>
                    </label>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-800 mb-2 dark:text-gray-300">
                        Módulo
                    </label>
                    <select
                        value={filters.module_key || ""}
                        onChange={handleDropdownChange}
                        className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                    >
                        <option value="" className="text-gray-500">
                            Seleccione un módulo
                        </option>
                        <option value="INVM">Inventario</option>
                        <option value="ARM">Cuentas por Cobrar</option>
                        <option value="BILM">Facturación</option>
                        <option value="PURM">Compras</option>
                        <option value="SECM">Seguridad</option>
                    </select>
                </div>
               
                <div className="flex justify-between items-center space-x-4">
                    <button
                        onClick={handleSubmit}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-transform transform hover:scale-105"
                    >
                        Generar
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-transform transform hover:scale-105"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
