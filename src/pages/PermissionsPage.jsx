import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../context/PermissionContext";
import ModalFastChargeOfData from "../components/ModalFastChargeOfData";
import Navbar from "../components/Navbar";
import EditPermissionForm from "../components/EditPermissionForm";
import CreatePermissionForm from "../components/CreatePermissionForm"; // Importa el nuevo componente
import ReportModalPermissionsForm from "../components/ReportModalPermissionsForm"; // Modal para exportación

import {
  faAddressCard,
  faEdit,
  faExchange,
  faEye,
  faPlug,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons/faToggleOn";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons/faToggleOff";
import { faDatabase } from "@fortawesome/free-solid-svg-icons/faDatabase";
import { faFolder } from "@fortawesome/free-solid-svg-icons"; // Ícono para exportar


const PermissionsPage = () => {
  const {
    permissions,
    fetchPermissions,
    createPermission,
    updatePermission,
    loading,
    pagination,
    setPagination,
  } = usePermissions();
  const [modalfastcharge, setShowModalFastChargeOfData] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [creatingPermission, setCreatingPermission] = useState(false);
  const [filters, setFilters] = useState({ name: "", active: "" });
  const navigate = useNavigate();
  const [modalReport, setShowModalReport] = useState(false);
  


  useEffect(() => {
    fetchPermissions({ page: pagination.page, limit: pagination.limit, });
  }, [pagination.page, pagination.limit]);

  const handleSearch = () => {
    console.log("Filtros enviados:", filters);
    fetchPermissions({ page: pagination.page, limit: pagination.limit, ...filters });
  };
  


  const handleEditPermission = (permission) => {
    setEditingPermission(permission);
  };

  const handleSavePermission = (id, updatedData) => {
    updatePermission(id, updatedData);
    setEditingPermission(null);
  };

  const handleCancelEdit = () => {
    setEditingPermission(null);
  };

  const handleCreatePermission = (permissionData) => {
    createPermission(permissionData);
    setCreatingPermission(false);
  };

  const handleToggleActive = (permission) => {
    updatePermission(permission.id, {
      ...permission,
      active: !permission.active,
    });
  };

  const handleViewPermission = (permission) => {
    navigate(`/permissions/${permission.id}`, { state: { permission } });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchPermissions({ page: newPage, limit: pagination.limit, ...filters, });
  };

  const handleCloseModalFastCharge = () => {
    setShowModalFastChargeOfData(false);
    fetchPermissions({ page: pagination.page, limit: pagination.limit });
  };

  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
            Gestión de Permisos
          </h1>
          <div className="mb-6 flex justify-end items-end">
            <button
              onClick={() => setCreatingPermission(true)}
              className="btn-Add"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar Permiso
            </button>
            <div>
              <button
                className="btn-Charge"
                onClick={() => setShowModalFastChargeOfData(true)}
              >
                <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                Carga Rápida
              </button>
              {modalfastcharge && <ModalFastChargeOfData onClose={handleCloseModalFastCharge} />}
            </div>
            <div>
              <button
                className="btn-Report"
                onClick={() => setShowModalReport(true)}
              >
                <FontAwesomeIcon icon={faFolder} className="mr-2" />
                Reportes
              </button>
              {modalReport && <ReportModalPermissionsForm onClose={() => setShowModalReport(false)} />}
            </div>
          </div>
        </div>
        {/* Filtros */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            name="name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            placeholder="Buscar por nombre"
            className="w-full md:w-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 dark:border-gray-500 dark:bg-gray-800"
          />
          <select
            name="active"
            value={filters.active}
            onChange={(e) => setFilters({ ...filters, active: e.target.value })}
            className="w-full md:w-48 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 dark:border-gray-500 dark:bg-gray-800"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
          <button
            onClick={handleSearch}
            className="btn-Search"
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
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="table-auto w-full text-sm text-gray-600 dark:bg-cyan-950 dark:text-gray-200">
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
                  <td colSpan="4" className="text-center py-4">
                    Cargando...
                  </td>
                </tr>
              ) : (
                permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-100 dark:hover:bg-cyan-900">
                    <td className="px-6 py-3"><FontAwesomeIcon icon={faAddressCard} className="mr-5" />{permission.name}</td>
                    <td className="px-6 py-3">{permission.description}</td>
                    <td className="px-6 py-3">
                      {permission.active ? (
                        <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold dark:bg-green-300 dark:text-green-900">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold dark:bg-red-300 dark:text-red-900">
                          Inactivo
                        </span>
                      )}
                    </td>
                    {/* Mostrar el estado */}
                    <td className="px-6 py-3 flex items-center gap-2">
                      <button
                        onClick={() => handleEditPermission(permission)}
                        className="btn btn-icon"
                      >
                        <FontAwesomeIcon icon={faEdit} className="" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(permission)}
                        className="btn btn-icon-toggle"
                        title={permission.active ? "Desactivar Rol" : "Activar Rol"}
                      >
                        <FontAwesomeIcon icon={permission.active ? faToggleOn : faToggleOff} className={permission.active ? "btn-icon-active" : ""} />
                      </button>
                      <button
                        onClick={() => handleViewPermission(permission)}
                        className="btn btn-icon"
                      >
                        <FontAwesomeIcon icon={faEye} className="" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="pagination-button"
          >
            Anterior
          </button>
          <span className="text-lg text-gray-800 dark:text-white">
            Página {pagination.page} de{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
            onClick={() => handlePageChange(pagination.page + 1)}
            className="pagination-button"
          >
            Siguiente
          </button>
        </div>
        {editingPermission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-800">
              <EditPermissionForm
                permission={editingPermission}
                onSave={handleSavePermission}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>
        )}
        {creatingPermission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-800">
              <CreatePermissionForm
                onSave={handleCreatePermission}
                onCancel={() => setCreatingPermission(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PermissionsPage;


