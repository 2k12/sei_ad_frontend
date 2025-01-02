import { createContext, useContext, useState } from "react";
import { roleApi } from "../api/axios.js";
import { toast } from "react-toastify";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchRoles = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await roleApi.getRoles({
        page: params.page || pagination.page,
        pageSize: params.pageSize || pagination.limit,
        name: params.name || "",
      });
      setRoles(data.roles);
      setPagination({
        page: data.page,
        limit: data.pageSize,
        total: data.total,
      });
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Error al obtener los roles.");
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo rol
  const createRole = async (roleData) => {
    try {
      const { data } = await roleApi.createRole(roleData);
      setRoles((prev) => [...prev, data.role]); // Actualiza la lista local
      toast.success("Rol creado correctamente.");
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Error al crear el rol.");
    }
  };

  const updateRole = async (id, roleData) => {
    try {
      await roleApi.updateRole(id, roleData);
      toast.success("Rol actualizado correctamente.");
      await fetchRoles();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error al actualizar el rol.");
    }
  };

  const deleteRole = async (id) => {
    try {
      await roleApi.deleteRole(id);
      toast.success("Rol eliminado correctamente.");
      await fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Error al eliminar el rol.");
    }
  };

  return (
    <RoleContext.Provider
      value={{
        roles,
        createRole,
        fetchRoles,
        updateRole,
        deleteRole,
        loading,
        pagination,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRoles = () => useContext(RoleContext);
