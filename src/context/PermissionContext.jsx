import { createContext, useContext, useState } from 'react';
import { permissionApi } from '../api/axios.js';
import { toast } from 'react-toastify';

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const { data } = await permissionApi.getPermissions();
      setPermissions(data.permissions);
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
      await fetchPermissions();
    } catch (error) {
      console.error('Error creating permission:', error);
      toast.error('Error al crear el permiso');
    }
  };

  const updatePermission = async (id, permissionData) => {
    try {
      await permissionApi.updatePermission(id, permissionData);
      toast.success('Permiso actualizado exitosamente');
      await fetchPermissions();
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Error al actualizar el permiso');
    }
  };

  const deletePermission = async (id) => {
    try {
      await permissionApi.deletePermission(id);
      toast.success('Permiso eliminado exitosamente');
      await fetchPermissions();
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
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionContext);