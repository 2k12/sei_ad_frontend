import { createContext, useContext, useState } from 'react';
import { permissionApi } from '../api/axios.js';
import { toast } from 'react-toastify';

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 }); // Límite establecido en 10

  const fetchPermissions = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const { data } = await permissionApi.getPermissions(page, limit);
      setPermissions(data.permissions);
      setPagination({ page: data.page, limit: data.limit, total: data.total });
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPermission = async (permissionData) => {
    try {
      await permissionApi.createPermission(permissionData);
      toast.success('Permiso creado exitosamente');
      await fetchPermissions(pagination.page, pagination.limit);
    } catch (error) {
      console.error('Error creating permission:', error);
      toast.error('Error al crear el permiso');
    }
  };

  const updatePermission = async (id, permissionData) => {
    try {
      await permissionApi.updatePermission(id, permissionData);
      toast.success('Permiso actualizado exitosamente');
      await fetchPermissions(pagination.page, pagination.limit);
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Error al actualizar el permiso');
    }
  };

  const deletePermission = async (id) => {
    try {
      await permissionApi.deletePermission(id);
      toast.success('Permiso eliminado exitosamente');
      await fetchPermissions(pagination.page, pagination.limit);
    } catch (error) {
      console.error('Error deleting permission:', error);
      toast.error('Error al eliminar el permiso');
    }
  };

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        fetchPermissions,
        createPermission,
        updatePermission,
        deletePermission,
        loading,
        pagination,
        setPagination,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionContext);