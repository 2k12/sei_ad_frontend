import { useState, useEffect } from "react";
import { reportApi, moduleApi } from "../api/axios";
import { toast } from "react-toastify";

const ReportModalPermissionsForm = ({ onClose }) => {
  const [filters, setFilters] = useState({ active: null, module_id: null });
  const [format, setFormat] = useState("pdf");
  const [modules, setModules] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const userName = decodedToken.Name || "Usuario desconocido";

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await moduleApi.getModules();
        const { modules } = response.data; // Extrae los módulos de la respuesta
        if (Array.isArray(modules)) {
          setModules(modules);
        } else {
          console.error("La propiedad 'modules' no es un arreglo:", modules);
          setError("Formato de datos incorrecto.");
        }
      } catch (error) {
        console.error("Error al cargar los módulos:", error);
        setError("Error al cargar los módulos.");
      } finally {
        setIsLoadingModules(false);
      }
    };
    fetchModules();
  }, []);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      active: name === "active" ? (checked ? true : null) : prev.active,
      ...(name === "inactive" && { active: checked ? false : null }),
    }));
  };

  const handleDropdownChange = (e) => {
    const { value } = e.target;
    setFilters((prev) => ({ ...prev, module_id: value || null }));
  };

  const handleSubmit = async () => {
    const payload = {
      model: "Permission",
      filters: {
        ...(filters.active !== null && { active: filters.active }),
        ...(filters.module_id && { module_id: filters.module_id }),
      },
      format,
      username: userName,
      option: "default",
    };

    try {
      const response = await reportApi.generateReport(payload);
      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type:
            format === "pdf"
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = format === "pdf" ? "reporte.pdf" : "reporte.xlsx";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Reporte generado con éxito.");
        onClose();
      } else {
        toast.error("Hubo un error al generar el reporte.");
        console.error("Error del servidor:", response.statusText);
      }
    } catch (error) {
      toast.error("Hubo un problema con la solicitud.");
      console.error("Error durante la solicitud:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-[500px] dark:bg-gray-900">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700 dark:text-gray-100">
          Generar Reporte de Permisos
        </h2>
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setFormat("pdf")}
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${format === "pdf"
              ? "bg-red-600 text-white border-red-600"
              : "bg-gray-200 text-gray-700 border-gray-300"
              }`}
          >
            PDF
          </button>
          <button
            onClick={() => setFormat("excel")}
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${format === "excel"
              ? "bg-green-600 text-white border-green-600"
              : "bg-gray-200 text-gray-700 border-gray-300"
              }`}
          >
            Excel
          </button>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-800 mb-2 dark:text-gray-300">
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
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Módulo
          </label>
          <select
            value={filters.module_id || ""}
            onChange={handleDropdownChange}
            className="w-full px-3 py-2 text-gray-700 border rounded dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            disabled={isLoadingModules || error !== null}
          >
            <option value="">Seleccionar módulo</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex mt-6 space-x-4">
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Generar
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModalPermissionsForm;
