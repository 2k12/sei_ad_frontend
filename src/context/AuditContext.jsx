import { createContext, useContext, useState } from "react";
import { auditApi } from "../api/axios.js";
import { toast } from "react-toastify";

const AuditContext = createContext();

export const AuditProvider = ({ children }) => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchAudits = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await auditApi.getAudits({
        page: params.page || pagination.page,
        pageSize: params.pageSize || pagination.limit,
        event: params.event || "",
      });
      setAudits(data.audits);
      setPagination({
        page: data.page,
        limit: data.pageSize,
        total: data.total,
      });
    } catch (error) {
      console.error("Error fetching Audits:", error);
      toast.error("Error al obtener los Auditoria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuditContext.Provider
      value={{
        audits,
        fetchAudits,
        loading,
        pagination,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};

export const useAudits = () => useContext(AuditContext);
