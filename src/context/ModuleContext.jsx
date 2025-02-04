import React, { createContext, useState, useContext, useMemo, useCallback } from "react";
import { moduleApi } from "../api/axios.js";
import { toast } from 'react-toastify';
import PropTypes from "prop-types";

// Crear el contexto
const ModuleContext = createContext();

// Proveedor del contexto
export const ModuleProvider = ({ children }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Función para obtener los módulos desde la API con paginación
  const fetchModules = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await moduleApi.getModules({
        page: params.page || pagination.page,
        pageSize: params.pageSize || pagination.limit,
        name: params.name || "",
      });
      setModules(data.modules);
      setPagination({
        page: data.page,
        limit: data.pageSize,
        total: data.total,
      });
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination]); // Se memoriza con `pagination` como dependencia

  // Función para agregar un módulo
  const addModule = useCallback(async (moduleData) => {
    try {
      await moduleApi.createModule(moduleData);
      await fetchModules({ page: pagination.page, pageSize: pagination.limit });
      toast.success('Módulo agregado satisfactoriamente');
    } catch (error) {
      console.error("Error adding module:", error);
      toast.error('Error al agregar el módulo');
    }
  }, [fetchModules, pagination]);

  // Función para actualizar un módulo
  const updateModule = useCallback(async (id, moduleData) => {
    try {
      await moduleApi.updateModule(id, moduleData);
      await fetchModules({ page: pagination.page, pageSize: pagination.limit });
      toast.success('Módulo actualizado satisfactoriamente');
    } catch (error) {
      console.error("Error updating module:", error);
      toast.error('Error al actualizar el módulo');
    }
  }, [fetchModules, pagination]);

  // Función para eliminar un módulo
  const deleteModule = useCallback(async (id) => {
    try {
      await moduleApi.deleteModule(id);
      await fetchModules({ page: pagination.page, pageSize: pagination.limit });
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  }, [fetchModules, pagination]);

  // Función para alternar el estado activo/inactivo de un módulo
  const toggleModuleActive = useCallback(async (id) => {
    try {
      await moduleApi.toggleModuleActive(id);
      await fetchModules({ page: pagination.page, pageSize: pagination.limit });
      toast.success('Estado del módulo actualizado satisfactoriamente');
    } catch (error) {
      console.error("Error toggling module active state:", error);
      toast.error('Error al actualizar el estado del módulo');
    }
  }, [fetchModules, pagination]);

  // Memorizar el `value` del Context para evitar recreaciones innecesarias
  const memoizedValue = useMemo(() => ({
    modules,
    loading,
    fetchModules,
    addModule,
    updateModule,
    deleteModule,
    toggleModuleActive,
    pagination,
    setPagination,
  }), [modules, loading, pagination, fetchModules, addModule, updateModule, deleteModule, toggleModuleActive]);

  return (
    <ModuleContext.Provider value={memoizedValue}>
      {children}
    </ModuleContext.Provider>
  );
};

ModuleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook personalizado para usar el contexto
export const useModuleContext = () => useContext(ModuleContext);
