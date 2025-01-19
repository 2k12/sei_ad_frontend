import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../context/PermissionContext";
import ModalFastChargeOfData from "../components/ModalFastChargeOfData";
import Navbar from "../components/Navbar";
import EditPermissionForm from "../components/EditPermissionForm";
import CreatePermissionForm from "../components/CreatePermissionForm"; // Importa el nuevo componente
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

  useEffect(() => {
    fetchPermissions({page: pagination.page, limit: pagination.limit,});
  }, [pagination.page, pagination.limit]);

  const handleSearch = () => {
    fetchPermissions({ page: pagination.page, limit: pagination.limit, ...filters, });
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
    fetchPermissions({page: newPage, limit: pagination.limit, ...filters,});
  };

  const handleCloseModalFastCharge = () => {
    setShowModalFastChargeOfData(false);
    fetchPermissions({ page: pagination.page, limit: pagination.limit });
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="main-container">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="header-title">
            Gestión de Permisos
          </h1>
          <div className="header-actions">
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
            { modalfastcharge && <ModalFastChargeOfData onClose={handleCloseModalFastCharge} />}
          </div>
          </div>
        </div>
        {/* Filtros */}
        <div className="filter-container">
          <input
            name="name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            placeholder="Buscar por nombre"
            className="filter-input"
          />
          <select
            name="active"
            value={filters.active}
            onChange={(e) => setFilters({ ...filters, active: e.target.value })}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
          <button
            onClick={handleSearch}
            className="btn-Search">
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
                  <td colSpan="4" className="text-center py-4">
                    Cargando...
                  </td>
                </tr>
              ) : (
                permissions.map((permission) => (
                  <tr key={permission.id} className="table-row">
                    <td className="table-cell"><FontAwesomeIcon icon={faAddressCard} className="mr-5"/>{permission.name}</td>
                    <td className="table-cell">{permission.description}</td>
                    <td className="table-cell">
                      {permission.active ? (
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
                        onClick={() => handleEditPermission(permission)}
                        className="btn btn-icon"
                      >
                        <FontAwesomeIcon icon={faEdit} className="" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(permission)}
                        className="btn btn-icon-toggle"
                        title={
                          permission.active ? "Desactivar Rol" : "Activar Rol"
                        }
                      >
                        <FontAwesomeIcon icon={permission.active ? faToggleOn : faToggleOff} className="btn-icon-active" />
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
        <div className="pagination-container">
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
            disabled={
              pagination.page === Math.ceil(pagination.total / pagination.limit)
            }
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
