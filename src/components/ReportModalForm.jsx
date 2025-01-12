import { useState, useEffect } from "react";
import { reportApi } from "../api/axios";
import { toast } from "react-toastify";
import { useUsers } from "../context/UserContext";

const ReportModal = ({ onClose }) => {
    const [filters, setFilters] = useState({ active: null, module_key: null, id: null });
    const { users, fetchUsersForDropdown } = useUsers();
    const [format, setFormat] = useState("pdf");
    const [activeSection, setActiveSection] = useState("usuarios"); // "usuarios" o "usuariosCompletos"
    const [option, setOption] = useState("usuarios"); // Establecer opción predeterminada según activeSection
    const token = localStorage.getItem("token");
    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
    const userName = decodedToken.Name || "Nombre de usuario";

    useEffect(() => {
        fetchUsersForDropdown();
    }, [fetchUsersForDropdown]);

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
            [activeSection === "usuarios" ? "module_key" : "id"]: value !== "" ? value : null,
        });
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                model: "User",
                filters: {
                    ...(filters.active !== null && { active: filters.active }),
                    ...(filters.module_key && { module_key: filters.module_key }),
                    ...(filters.id && { id: filters.id }),
                },
                format,
                username: userName,
                option: option // Enviar la opción de acuerdo a la sección activa
            };

            const response = await reportApi.generateReport(payload);

            if (response.status === 200) {
                const blob = new Blob([response.data], {
                    type:
                        format === "pdf"
                            ? "application/pdf"
                            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = format === "pdf" ? "reporte.pdf" : "reporte.xlsx";
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
            <div className="bg-white p-8 rounded-xl shadow-2xl w-[500px] dark:bg-gray-900">
                {/* Chips de formato */}
                <h2 className="text-2xl font-semibold mb-6 text-gray-600 dark:text-white dark:font-semibold text-center">
                    Generar Reporte
                </h2>
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        className={`px-4 py-1 rounded-full text-sm font-semibold border transition-all ${format === "pdf"
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-gray-200 text-white border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                            }`}
                        onClick={() => setFormat("pdf")}
                    >
                        PDF
                    </button>
                    <button
                        className={`px-4 py-1 rounded-full text-sm font-semibold border transition-all ${format === "excel"
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-gray-200 text-white border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                            }`}
                        onClick={() => setFormat("excel")}
                    >
                        Excel
                    </button>
                </div>

                {/* Pestañas */}
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        className={`px-6 py-2 font-semibold border-b-2 transition-all ${activeSection === "usuarios"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-800 dark:text-gray-300"
                            }`}
                        onClick={() => { setActiveSection("usuarios"); setOption("usuarios"); }} // Actualizamos el option al cambiar la sección
                    >
                        Usuarios
                    </button>
                    <button
                        className={`px-6 py-2 font-semibold border-b-2 transition-all ${activeSection === "usuariosCompletos"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-800 dark:text-gray-300"
                            }`}
                        onClick={() => { setActiveSection("usuariosCompletos"); setOption("usuariosCompletos"); }} // Actualizamos el option al cambiar la sección
                    >
                        Usuarios Completos
                    </button>
                </div>

                {/* Contenido de la sección activa */}
                {activeSection === "usuarios" && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2 dark:text-gray-300">
                            Estados
                        </label>
                        <div className="mb-4">
                            <label className="flex items-center space-x-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={filters.active === true}
                                    onChange={handleCheckboxChange}
                                    className="h-5 w-5 accent-blue-500 rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Usuarios Activos
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
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Usuarios Inactivos
                                </span>
                            </label>
                        </div>
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
                )}

                {activeSection === "usuariosCompletos" && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2 dark:text-gray-300">
                            Seleccione un Usuario
                        </label>
                        <select
                            value={filters.id || ""}
                            onChange={handleDropdownChange}
                            className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                        >
                            <option value="" className="text-gray-500">
                                Seleccione un usuario
                            </option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="flex justify-between items-center space-x-4 mt-6">
                    <button
                        onClick={handleSubmit}
                        className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold text-sm shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-transform transform hover:scale-105"
                    >
                        Generar
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-gray-300 text-gray-800 rounded-md font-semibold text-sm shadow-sm hover:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-transform transform hover:scale-105"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
