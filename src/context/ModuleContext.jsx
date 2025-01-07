import React, { createContext, useState, useContext, useEffect } from "react";
import { moduleApi } from "../api/axios.js";

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
  // const fetchModules = async (page = 1, limit = 10) => {
  //   setLoading(true);
  //   try {
  //     const response = await moduleApi.getModules({ page, limit });
  //     setModules(response.data.modules); // Datos de los módulos
  //     setPagination((prev) => ({
  //       ...prev,
  //       page,
  //       limit,
  //       total: response.data.total, // Total de registros devueltos por el backend
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching modules:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  
      const fetchModules = async (params = {}) => {
          setLoading(true);
          try {
              const { data } = await moduleApi.getModules({
                  page: params.page || pagination.page,
                  pageSize: params.pageSize || pagination.limit,
                  name: params.name || '',
              });
              setModules(data.modules);
              setPagination({
                  page: data.page,
                  limit: data.pageSize,
                  total: data.total,
              });
          } catch (error) {
              console.error('Error fetching modules:', error);
          } finally {
              setLoading(false);
          }
      };
  
  // Función para agregar un módulo
  const addModule = async (moduleData) => {
    try {
      await moduleApi.createModule(moduleData);
      await fetchModules(pagination.page, pagination.limit); // Refresca la lista después de agregar
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  // Función para actualizar un módulo
  const updateModule = async (id, moduleData) => {
    try {
      await moduleApi.updateModule(id, moduleData);
      await fetchModules(pagination.page, pagination.limit); // Refresca la lista después de actualizar
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  // Función para eliminar un módulo
  const deleteModule = async (id) => {
    try {
      await moduleApi.deleteModule(id);
      await fetchModules(pagination.page, pagination.limit); // Refresca la lista después de eliminar
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  // Función para alternar el estado activo/inactivo de un módulo
  const toggleModuleActive = async (id) => {
    try {
      await moduleApi.toggleModuleActive(id);
      await fetchModules(pagination.page, pagination.limit); // Refresca la lista después de alternar el estado
    } catch (error) {
      console.error("Error toggling module active state:", error);
    }
  };

  // Obtener los módulos cuando el componente se monta
  useEffect(() => {
    fetchModules(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);

  // Proveer el estado y las funciones al contexto
  return (
    <ModuleContext.Provider
      value={{
        modules,
        loading,
        fetchModules,
        addModule,
        updateModule,
        deleteModule,
        toggleModuleActive,
        pagination,
        setPagination,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useModuleContext = () => useContext(ModuleContext);
