import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportModalModulesForm from "../components/ReportModalModulesForm";
import { faEdit, faPlus, faToggleOn, faToggleOff, faAddressBook, faCertificate, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { useModuleContext } from "../context/ModuleContext";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";


const ModulePage = () => {
  const {
    modules,
    loading,
    fetchModules,
    addModule,
    updateModule,
    pagination
    //toggleModuleActive,
  } = useModuleContext();

  const [filters, setFilters] = useState({ name: "" });
  const [editingModule, setEditingModule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newModule, setNewModule] = useState({ name: "", description: "", active: true });
  const [modalreport, setShowModalReportModules] = useState(false);

  useEffect(() => {
    fetchModules({
      page: pagination.page,
      pageSize: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  const handleSearch = () => {
    fetchModules({ page: pagination.page, pageSize: pagination.limit, ...filters });
}; 


  const handleAddModule = async () => {
    try {
      if (editingModule) {
        await updateModule(editingModule.id, newModule);
      } else {
        await addModule(newModule);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar el módulo:", error);
    }
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setNewModule(module);
    setShowModal(true);
  };

  const handleToggleActive = (module) => {
    updateModule(module.id, { ...module, active: !module.active });
  };

  const handlePageChange = (newPage) => {
    fetchModules({ page: newPage, pageSize: pagination.limit, ...filters });
  };




  return (
    <div className="page-container">
      <Navbar />
      <div className="main-container">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="header-title">Gestión de Módulos</h1>
          <div className="header-actions">
            <button
              onClick={() => {
                setEditingModule(null);
                setNewModule({ name: "", description: "", active: true });
                setShowModal(true);
              }}
              className="btn-Add"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar Módulo
            </button>
            <div>
              <button
              className="btn-Report"
              onClick={() => setShowModalReportModules(true)}
              >
                  <FontAwesomeIcon icon={faFolder} className="mr-2" />
                  Reportes
                </button>
                { modalreport && <ReportModalModulesForm onClose={() => setShowModalReportModules(false)} />}
                </div>
              </div>
        </div>

        {/* Filtros */}
        <div className="filter-container">
          <input
            name="name"
            value={filters.name}
            // onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
            placeholder="Buscar por nombre"
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
                <th className="table-row-header">Nombre</th>
                <th className="table-row-header">Descripción</th>
                <th className="table-row-header">Estado</th>
                <th className="table-row-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">Cargando...</td>
                </tr>
              ) : modules.length > 0 ? (
                modules.map((module) => (
                  <tr key={module.id} className="table-row">
                    <td className="table-cell"><FontAwesomeIcon icon={faMinus} className="mr-3"/>{module.name}</td>
                    <td className="table-cell">{module.description}</td>
                    <td className="table-cell">
                      {module.active ? (
                        <span className="label-active">
                          Activo
                        </span>
                      ) : (
                        <span className="label-inactive">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 flex items-center gap-2">
                      <button
                        onClick={() => handleEditModule(module)}
                        className="btn btn-icon"
                        title="Editar Módulo"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(module)}
                        className="btn btn-icon-toggle"
                        title={module.active ? "Desactivar módulo" : "Activar módulo"}
                      >
                        <FontAwesomeIcon icon={module.active ? faToggleOn : faToggleOff} className="btn-icon-active" />
                      </button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">No se encontraron módulos.</td>
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

        {/* Modal para agregar/editar */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-slate-700">
              <h2 className="text-xl font-bold mb-4 dark:text-white">
                {editingModule ? "Editar Módulo" : "Agregar Módulo"}
              </h2>
              <input
                type="text"
                placeholder="Nombre"
                value={newModule.name}
                onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              />
              <textarea
                placeholder="Descripción"
                value={newModule.description}
                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              />
              <button
                onClick={handleAddModule}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="ml-4 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulePage;
