import { useState } from "react";
import { reportApi } from "../api/axios";
import { toast } from "react-toastify";

const ReportModalModules = ({ onClose }) => {
    const [filters, setFilters] = useState({ active: null, startDate: "", endDate: "", format: "pdf" });
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

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
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
            const dateRange =
                filters.startDate && filters.endDate
                    ? { start: filters.startDate, end: filters.endDate }
                    : null;

            const payload = {
                model: "Module",
                filters: {
                    ...(filters.active !== null && { active: filters.active }),
                    ...(dateRange && { date_range: dateRange }),
                },
                format: filters.format,
                username: userName,
            };
            console.log("Payload enviado al backend:", payload);

            const response = await reportApi.generateReport(payload);

            if (response.status === 200) {
                const blob = new Blob([response.data], {
                    type:
                        filters.format === "pdf"
                            ? "application/pdf"
                            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filters.format === "pdf" ? "reporte_modules.pdf" : "reporte_modules.xlsx";
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
                    Generar Reporte de Módulos
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
                        Rango de Fechas
                    </label>
                    <div className="flex flex-col space-y-4">
                        <div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Inicio:</span>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleDateChange}
                                className="block w-full px-4 py-2 mt-1 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Fin:</span>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleDateChange}
                                className="block w-full px-4 py-2 mt-1 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                            />
                        </div>
                    </div>
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

export default ReportModalModules;
