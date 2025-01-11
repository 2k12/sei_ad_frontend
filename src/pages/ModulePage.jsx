import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faToggleOn, faToggleOff, faAddressBook, faCertificate, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { useModuleContext } from "../context/ModuleContext";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";


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
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">Gestión de Módulos</h1>
          <button
            onClick={() => {
              setEditingModule(null);
              setNewModule({ name: "", description: "", active: true });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Agregar Módulo
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            name="name"
            value={filters.name}
            // onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
            placeholder="Buscar por nombre"
            className="w-full md:w-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 dark:bg-gray-800"
          />
          <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-900"
                    >
                        Buscar
                    </button>
        </div>

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
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Descripción</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">Cargando...</td>
                </tr>
              ) : modules.length > 0 ? (
                modules.map((module) => (
                  <tr key={module.id} className="hover:bg-gray-100 dark:hover:bg-cyan-900">
                    <td className="px-6 py-3"><FontAwesomeIcon icon={faMinus} className="mr-3"/>{module.name}</td>
                    <td className="px-6 py-3">{module.description}</td>
                    <td className="px-6 py-3">
                      {module.active ? (
                        <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold dark:bg-green-300 dark:text-green-900">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold dark:bg-red-300 dark:text-red-900">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 flex items-center gap-2">
                      <button
                        onClick={() => handleEditModule(module)}
                        className="px-3 py-2 bg-gray-200 text-blue-500 rounded-lg hover:bg-gray-400 transition dark:text-gray-200 dark:bg-blue-800 dark:hover:bg-blue-500"
                        title="Editar Módulo"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(module)}
                        className="px-3 py-2 bg-gray-200 text-yellow-500 rounded-lg hover:bg-yellow-400 transition dark:bg-gray-300 dark:hover:bg-gray-400"
                        title={module.active ? "Desactivar módulo" : "Activar módulo"}
                      >
                        <FontAwesomeIcon icon={module.active ? faToggleOn : faToggleOff} className={module.active ? "text-green-800" : "text-red-800"} />
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
            className="bg-gray-300 p-2 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-200 dark:bg-cyan-900 dark:disabled:opacity-70 dark:enabled:opacity-100"
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
