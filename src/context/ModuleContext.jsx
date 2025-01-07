import React, { createContext, useState, useContext, useEffect } from "react";
import { moduleApi } from "../api/axios.js";

// Crear el contexto
const ModuleContext = createContext();

// Proveedor del contexto
export const ModuleProvider = ({ children }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para obtener los módulos desde la API
  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await moduleApi.getModules();
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un módulo
  const addModule = async (moduleData) => {
    try {
      await moduleApi.createModule(moduleData);
      await fetchModules(); // Refresca la lista después de agregar
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  // Función para actualizar un módulo
  const updateModule = async (id, moduleData) => {

    try {
      await moduleApi.updateModule(id, moduleData);
      await fetchModules(); // Refresca la lista después de actualizar
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  // Función para eliminar un módulo
  const deleteModule = async (id) => {
    try {
      await moduleApi.deleteModule(id);
      await fetchModules(); // Refresca la lista después de eliminar
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };



  // Función para alternar el estado activo/inactivo de un módulo
  // const toggleModuleActive = async (id) => {
  //   try {
  //     await moduleApi.toggleModuleActive(id);
  //     await fetchModules(); // Refresca la lista después de alternar el estado
  //   } catch (error) {
  //     console.error("Error toggling module active state:", error);
  //   }
  // };

  // Obtener los módulos cuando el componente se monta
  useEffect(() => {
    fetchModules();
  }, []);

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
        //toggleModuleActive,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useModuleContext = () => useContext(ModuleContext);
