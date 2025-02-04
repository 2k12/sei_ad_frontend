import { createContext, useContext, useState, useMemo } from "react";
import PropTypes from "prop-types"; 
import { permissionApi } from "../api/axios.js";
import { toast } from "react-toastify";

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  }); // Límite establecido en 10

  const fetchPermissions = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await permissionApi.getPermissions({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        name: params.name || "", // Filtro por nombre
        active: params.active || "", // Filtro por estado
      });

      // Actualizar permisos y datos de paginación
      setPermissions(data.permissions);
      setPagination({
        page: data.page,
        limit: data.pageSize,
        total: data.total,
      });
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast.error("Error al obtener los permisos");
    } finally {
      setLoading(false);
    }
  };

  const createPermission = async (permissionData) => {
    try {
      await permissionApi.createPermission(permissionData);
      toast.success("Permiso creado exitosamente");
      await fetchPermissions({
        page: pagination.page,
        limit: pagination.limit,
      });
    } catch (error) {
      console.error("Error creating permission:", error);
      toast.error("Error al crear el permiso");
    }
  };

  const updatePermission = async (id, permissionData) => {
    try {
      await permissionApi.updatePermission(id, permissionData);
      toast.success("Permiso actualizado exitosamente");
      await fetchPermissions({
        page: pagination.page,
        limit: pagination.limit,
      });
    } catch (error) {
      console.error("Error updating permission:", error);
      toast.error("Error al actualizar el permiso");
    }
  };

  const deletePermission = async (id) => {
    try {
      await permissionApi.deletePermission(id);
      toast.success("Permiso eliminado exitosamente");
      await fetchPermissions({
        page: pagination.page,
        limit: pagination.limit,
      });
    } catch (error) {
      console.error("Error deleting permission:", error);
      toast.error("Error al eliminar el permiso");
    }
  };

  const memoizedValue = useMemo(() => ({
    permissions,
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    loading,
    pagination,
    setPagination,
  }), [permissions, loading, pagination]);

  return (
    <PermissionContext.Provider value={memoizedValue}>
      {children}
    </PermissionContext.Provider>
  );
};

PermissionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const usePermissions = () => useContext(PermissionContext);
