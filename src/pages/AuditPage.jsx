import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAudits } from "../context/AuditContext";
import Navbar from "../components/Navbar";
import ReportModalAudits from "../components/ReportModalAudits"; // Importar el modal
import AuditStatistics from "../components/AuditStatistics"; // Componente de gráficos

const AuditsPage = () => {
  // Extraer datos del contexto
  const { audits, loading, pagination, fetchAudits } = useAudits();

  const navigate = useNavigate();

  // Estados locales
  const [filters, setFilters] = useState({ event: "" });
  const [showReportModal, setShowReportModal] = useState(false); // Modal para reportes
  const [showGraph, setShowGraph] = useState(false); // Estado para alternar vista

  // Manejar cambios en los filtros
  const handleSearch = () => {
    fetchAudits({ page: pagination.page, pageSize: pagination.limit, ...filters });
  };

  // Llamada inicial para obtener datos
  useEffect(() => {
    fetchAudits({
      page: pagination.page,
      pageSize: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  // Cambiar de página
  const handlePageChange = (newPage) =>
    fetchAudits({ page: newPage, pageSize: pagination.limit, ...filters });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Título y botones */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">Auditoría</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowGraph(!showGraph)} // Alternar entre vista de gráficos y tabla
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-900"
            >
              {showGraph ? "Ver Tabla" : "Ver Gráficos"}
            </button>
            {!showGraph && ( // Mostrar el botón "Generar Reporte" solo si no está en vista de gráficos
              <button
                onClick={() => setShowReportModal(true)} // Mostrar el modal
                className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition dark:bg-purple-700 dark:hover:bg-purple-900"
              >
                Generar Reporte
              </button>
            )}
          </div>
        </div>

        {/* Filtros: Mostrar solo si NO está en modo gráfico */}
        {!showGraph && (
          <div className="mb-6 flex gap-4 items-center">
            <input
              name="event"
              value={filters.event}
              onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
              placeholder="Buscar por evento"
              className="w-full md:w-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:border-gray-500 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-900"
            >
              Buscar
            </button>
          </div>
        )}

        {/* Vista condicional: Tabla o Gráficos */}
        {showGraph ? (
          <AuditStatistics filters={filters} /> // Mostrar gráficos
        ) : (
          <>
            {/* Tabla */}
            <div className="mb-4 text-right">
              <span className="text-lg text-gray-500 dark:text-gray-500">
                Total de registros: {pagination.total}
              </span>
            </div>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg dark:border-gray-500 dark:bg-cyan-950">
              <table className="table-auto w-full text-sm text-gray-600 dark:text-white">
                <thead className="bg-gray-200 dark:bg-cyan-800 dark:text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Evento</th>
                    <th className="px-6 py-3 text-center">Descripción</th>
                    <th className="px-6 py-3 text-left">Usuario</th>
                    <th className="px-6 py-3 text-left">Servicio</th>
                    <th className="px-6 py-3 text-left">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        Cargando...
                      </td>
                    </tr>
                  ) : audits && audits.length > 0 ? (
                    audits.map((audit) => (
                      <tr key={audit.id} className="hover:bg-gray-100 dark:hover:bg-cyan-900">
                        <td className="px-6 py-3">{audit.event}</td>
                        <td className="px-6 py-3">{audit.description}</td>
                        <td className="px-6 py-3">{audit.user}</td>
                        <td className="px-6 py-3">{audit.origin_service}</td>
                        <td className="px-6 py-3">
                          {new Intl.DateTimeFormat("es-ES", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(audit.date))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        Sin resultados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="mt-6 flex justify-between items-center">
              <button
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-200 dark:bg-cyan-950 dark:disabled:opacity-70 dark:enabled:opacity-100"
              >
                Anterior
              </button>
              <span className="text-lg dark:text-white">
                Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <button
                disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-200 dark:bg-cyan-950 dark:disabled:opacity-70 dark:enabled:opacity-100"
              >
                Siguiente
              </button>
            </div>
          </>
        )}

        {/* Modal de Reportes */}
        {showReportModal && <ReportModalAudits onClose={() => setShowReportModal(false)} />}
      </div>
    </div>
  );
};

export default AuditsPage;
