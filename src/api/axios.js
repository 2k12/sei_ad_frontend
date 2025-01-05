import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userApi = {
  getUsers: (params) => axiosInstance.get("/users", { params }),
  createUser: (userData) => axiosInstance.post("/users", userData),
  updateUser: (id, userData) => axiosInstance.put(`/users/${id}`, userData),
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
};

export const permissionApi = {
  getPermissions: (page = 1, limit = 10) => axiosInstance.get(`/permissions?page=${page}&limit=${limit}`),
  createPermission: (permissionData) => axiosInstance.post("/permissions", permissionData),
  updatePermission: (id, permissionData) => axiosInstance.put(`/permissions/${id}`, permissionData),
  deletePermission: (id) => axiosInstance.delete(`/permissions/${id}`),
  getPermissionById: (id) => axiosInstance.get(`/permissions/${id}`), // Nueva función
};

//export const moduleApi = {
//  getModules: () => axiosInstance.get("/modules"),
//};

export default axiosInstance;
