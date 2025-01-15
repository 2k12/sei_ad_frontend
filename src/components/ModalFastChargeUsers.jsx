import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { userApi } from "../api/axios";

const ModalFastChargeUsers = ({ onClose, fetchUsers }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Por favor, selecciona un archivo.");
            return;
        }
        setLoading(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const transformedData = jsonData.map((row) => ({
                name: row.name ? String(row.name).trim() : null,
                email: row.email ? String(row.email).trim() : null,
                password: row.password ? String(row.password).trim() : null,
                active: row.active?.toLowerCase() === "true",
                role_id: parseInt(row.role_id, 10),
            }));

            if (transformedData.some((user) => !user.name || !user.email || !user.role_id)) {
                toast.error(
                    "Por favor, verifica que los campos 'name', 'email', y 'role_id' estén completos en todas las filas."
                );
                setLoading(false);
                return;
            }

            await userApi.chargeFastUsers(transformedData);

            toast.success("Usuarios cargados exitosamente.");
            fetchUsers(); // Actualiza la lista de usuarios
            onClose();
        } catch (error) {
            console.error("Error al procesar el archivo:", error);
            toast.error(
                "Hubo un problema al cargar los usuarios. Por favor, verifica el archivo o el servidor."
            );
        }
        setLoading(false);
    };

    const handleDownloadTemplate = () => {
        window.location.href = "/plantillas/users_template.xlsx";
        toast.success("Plantilla descargada correctamente.");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-[400px] dark:bg-gray-900">
                <h2 className="text-2xl font-semibold mb-6 text-gray-600 dark:text-white text-center">
                    Cargar Usuarios
                </h2>
                <label className="text-left text-gray-500 dark:text-gray-300 mb-6">
                    Utiliza la plantilla requerida antes de cargar el archivo:
                </label>
                <button
                    onClick={handleDownloadTemplate}
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
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full px-6 py-3 ${
                            loading ? "bg-indigo-500 text-gray-200 cursor-not-allowed" : "bg-blue-600 text-white"
                        } rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-transform transform hover:scale-105`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-white"
                                    viewBox="0 0 24 24"
                                ></svg>
                                Procesando...
                            </div>
                        ) : (
                            "Subir"
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-full px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-transform transform hover:scale-105"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalFastChargeUsers;
