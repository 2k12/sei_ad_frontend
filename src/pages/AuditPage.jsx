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
  const handleFilterChange = (e) => {
    const { name, value } = e.target; // Corregido: usar name en lugar de event
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Llamada inicial para obtener datos
  useEffect(() => {
    fetchAudits({
      page: pagination.page,
      pageSize: pagination.limit,
      ...filters,
    });
  }, [pagination.page, pagination.limit, filters]);

  // Cambiar de página
  const handlePageChange = (newPage) =>
    fetchAudits({ page: newPage, pageSize: pagination.limit, ...filters });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">Auditoría</h1>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            name="event"
            value={filters.event}
            onChange={handleFilterChange}
            placeholder="Buscar por evento"
            className="w-full md:w-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="table-auto w-full text-sm text-gray-600">
            <thead className="bg-gray-200">
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
                  <tr key={audit.id} className="hover:bg-gray-100">
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
            className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700"
          >
            Anterior
          </button>
          <span className="text-lg">
            Página {pagination.page} de{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            disabled={
              pagination.page === Math.ceil(pagination.total / pagination.limit)
            }
            onClick={() => handlePageChange(pagination.page + 1)}
            className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditsPage;
