import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAudits } from "../context/AuditContext";
import Navbar from "../components/Navbar";

const AuditsPage = () => {
  // Extraer datos del contexto
  const { audits, loading, pagination, fetchAudits } = useAudits();

  const navigate = useNavigate();

  // Estados locales para filtros
  const [filters, setFilters] = useState({ event: "" });

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
        <div className="mb-6 flex justify-between items-center">
          <h1 className="header-title">Auditoría</h1>
        </div>

        {/* Filtros */}
        <div className="filter-container">
          <input
            name="event"
            value={filters.event}
            onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
            placeholder="Buscar por evento"
            className="filter-input"
          />
          <button
                        onClick={handleSearch}
                        className="btn-Search"
                    >
                        Buscar
                    </button>
        </div>

        <div className="mb-4 text-right">
          <span className="text-lg text-gray-500 dark:text-gray-500">
            Total de registros: {pagination.total}
          </span>
        </div>
        {/* Tabla */}
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
            Página {pagination.page} de{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            disabled={
              pagination.page === Math.ceil(pagination.total / pagination.limit)
            }
            onClick={() => handlePageChange(pagination.page + 1)}
            className="pagination-button"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditsPage;
