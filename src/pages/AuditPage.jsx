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
    <div className="page-container">
      <Navbar />
      <div className="main-container">
        {/* Título y botones */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="header-title">
            Auditoría
            </h1>
          <div className="header-actions">
            <button
              onClick={() => setShowGraph(!showGraph)} // Alternar entre vista de gráficos y tabla
              className="btn-Add"
            >
              {showGraph ? "Ver Tabla" : "Ver Gráficos"}
            </button>
            {!showGraph && ( // Mostrar el botón "Generar Reporte" solo si no está en vista de gráficos
              <button
                onClick={() => setShowReportModal(true)} // Mostrar el modal
                className="btn-Add"
            >
                Reportes
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
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-row-header">Evento</th>
                    <th className="px-6 py-3 text-center">Descripción</th>
                    <th className="table-row-header">Usuario</th>
                    <th className="table-row-header">Servicio</th>
                    <th className="table-row-header">Fecha</th>
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
                      <tr key={audit.id} className="table-row">
                        <td className="table-cell">{audit.event}</td>
                        <td className="table-cell">{audit.description}</td>
                        <td className="table-cell">{audit.user}</td>
                        <td className="table-cell">{audit.origin_service}</td>
                        <td className="table-cell">
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
            <div className="pagination-container">
              <button
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="pagination-button"
              >
                Anterior
              </button>
              <span className="text-lg dark:text-white">
                Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <button
                disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="pagination-button"
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
