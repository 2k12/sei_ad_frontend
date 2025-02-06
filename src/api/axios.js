import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://seri-api-utn-2024.fly.dev/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local
    if (token) {
      const base64Payload = token.split(".")[1]; // Obtener la parte payload
      const payload = JSON.parse(atob(base64Payload)); // Decodificar el payload
      console.log("Contenido del payload:", payload);
    }
    const expirationTime = 1737865743; // Valor del campo exp
const expirationDate = new Date(expirationTime * 1000); // Convertir a milisegundos
console.log("Fecha de expiración:", expirationDate);

    

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si el token es inválido o ha expirado
      localStorage.removeItem("token"); // Elimina el token
      window.location.href = "/login"; // Redirige al login
      toast.error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
    }
    return Promise.reject(error);
  }
);


export const userApi = {
  getUsers: (params) => axiosInstance.get("/users", { params }),
  getUsersForDropdown: () => axiosInstance.get("/users-dropdown"),
  createUser: (userData) => axiosInstance.post("/users", userData),
  chargeFastUsers: (userData) =>
    axiosInstance.post("/users/fastCharge", userData),
  updateUser: (id, userData) => axiosInstance.put(`/users/${id}`, userData),
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
};
export const roleApi = {
  createRole: (roleData) => axiosInstance.post("/roles", roleData),
  getRoles: (params) => axiosInstance.get("/roles", { params }),
  getRolesForDropdown: () => axiosInstance.get("/roles-dropdown"),
  updateRole: (id, roleData) => axiosInstance.put(`/roles/${id}`, roleData),
  // deleteRole: (id) => axiosInstance.delete(`/roles/${id}`),
  updateRoleState: (id, stateData) =>
    axiosInstance.put(`/roles/${id}/state`, stateData),
};
export const auditApi = {
  getAudits: (params) => axiosInstance.get("/audit", { params }),
  getAuditStatistics: (params) => axiosInstance.get("/audit/statistics", { params }),
};

export const roleUserApi = {
  getRolePermissions: (roleId) =>
    axiosInstance.get(`/roles/${roleId}/permissions`),
  assignPermission: (roleId, permissionId) =>
    axiosInstance.post(`/roles/${roleId}/permissions`, {
      permission_id: permissionId,
    }),
    removePermission: (roleId, permissionId) =>
      axiosInstance.delete(`/roles/${roleId}/permissions`, {
        data: { permission_id: permissionId }, // Enviar el ID del permiso en el cuerpo
      }),
      getPermissionsByRole: (roleId) =>
        axiosInstance.get(`/roles/${roleId}/permissions`),          
  getActivePermissions: () => axiosInstance.get("/permissions/active"), // Utilizamos el nuevo endpoint
};

export const permissionApi = {
  getPermissions: (params = {}) =>
    axiosInstance.get(`/permissions`, { params }),
  createPermission: (permissionData) =>
    axiosInstance.post("/permissions", permissionData),
  updatePermission: (id, permissionData) =>
    axiosInstance.put(`/permissions/${id}`, permissionData),
  deletePermission: (id) => axiosInstance.delete(`/permissions/${id}`),
  getPermissionById: async (id) => {
    try {
      const response = await axiosInstance.get(`/permissions/${id}`);
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching permission by ID:", error);
      throw error;
    }
  },
  uploadPermissions: (permissionsData) =>
    axiosInstance.post("/permissions/fastCharge", permissionsData),
};

export const moduleApi = {
  getModules: (page = 1, limit = 10) =>
    axiosInstance.get(`/modules?page=${page}&limit=${limit}`),

  getModules: (params) => axiosInstance.get("/modules", { params }), 
  getActiveModules: () => axiosInstance.get("/modules/active"),
  // Recupera todos los módulos con paginación y filtros
  createModule: (moduleData) => axiosInstance.post("/modules", moduleData),
  updateModule: (id, moduleData) =>
    axiosInstance.put(`/modules/${id}`, moduleData),
};

export const role_UserApi = {
  getUserRoles: (userId) => axiosInstance.get(`/users/${userId}/roles`),
  assignRoleToUser: (userId, roleId) =>
    axiosInstance.post(`/users/${userId}/roles`, { role_id: roleId }),
  removeRoleFromUser: (userId, roleId) =>
    axiosInstance.delete(`/users/${userId}/roles/${roleId}`),
  getRoles: (params) => axiosInstance.get("/roles", { params }),
  getRolesActive: () => axiosInstance.get("/roles-active"),
};

export const reportApi = {
  generateReport: (all) =>
    axiosInstance.post("/generate-report", all, { responseType: "blob" }),
};

export const authApi = {
  // Solicitar restablecimiento de contraseña
  requestPasswordReset: (email) =>
    axiosInstance.post("/request-reset", { email: email }, {
      headers: { "Content-Type": "application/json", Authorization: "" },
    }),

  resetPassword: (token, password) =>
    axiosInstance.post("/reset-password", { token, password }),
};
export default axiosInstance;
