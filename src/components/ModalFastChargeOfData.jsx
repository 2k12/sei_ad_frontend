import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { permissionApi } from "../api/axios";

const ModalFastChargeOfData = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar el estado de carga

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Por favor, selecciona un archivo.");
            return;
        }

        setIsLoading(true); // Cambiar estado a cargando

        try {
            // Leer el archivo Excel
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Transformar los datos para la API
            const transformedData = jsonData.map((row) => ({
                name: row.name?.trim() || null,
                description: row.description?.trim() || null,
                module_id: parseInt(row.module_id, 10),
            }));

            // Validar los datos
            const hasErrors = transformedData.some(
                (item) => !item.name || !item.module_id
            );

            if (hasErrors) {
                toast.error(
                    "Por favor, verifica que los campos 'name' y 'module_id' estén completos y correctos en todas las filas."
                );
                setIsLoading(false); // Resetear estado de carga
                return;
            }

            await permissionApi.uploadPermissions(transformedData);

            toast.success("Permisos cargados exitosamente.");
            onClose();
        } catch (error) {
            console.error("Error al procesar el archivo:", error);
            toast.error(
                "Hubo un problema al cargar los permisos. Por favor, verifica el archivo o el servidor."
            );
        } finally {
            setIsLoading(false); // Asegurarse de resetear el estado de carga
        }
    };

    const handleDownload = () => {
        window.location.href = "/plantillas/permiso_template.xlsx";
        toast.success("Plantilla descargada correctamente.");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-[400px] dark:bg-gray-900">
                <h2 className="text-2xl font-semibold mb-6 text-gray-600 dark:text-white text-center">
                    Cargar Permisos
                </h2>
                <label className="text-left text-gray-500 dark:text-gray-300 mb-6">
                    Utiliza la plantilla requerida antes de cargar el archivo:
                </label>
                <button
                    onClick={handleDownload}
                    className="text-blue-600 dark:text-blue-400 font-semibold mb-6 underline"
                >
                    Descargar Plantilla
                </button>
                <div className="mt-7 mb-6">
                    <label className="block text-sm font-semibold text-gray-800 mb-2 dark:text-gray-300">
                        Seleccionar Archivo
                    </label>
                    <div className="flex items-center justify-center">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-800 dark:text-gray-300 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700 transition"
                        >
                            {file ? file.name : "Seleccionar Archivo"}
                        </label>
                    </div>
                </div>
                <div className="flex justify-between items-center space-x-4">
                    {/* Botón "Subir" */}
                    <button
                        onClick={handleSubmit}
                        className={`w-full px-6 py-3 rounded-lg font-semibold text-lg shadow-lg flex items-center justify-center ${
                            isLoading
                                ? "bg-indigo-500 text-white"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        }rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-transform transform hover:scale-105`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                                Procesando...
                            </>
                        ) : (
                            "Subir"
                        )}
                    </button>
                    {/* Botón "Cerrar" */}
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-transform transform hover:scale-105"
                        disabled={isLoading}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalFastChargeOfData;
