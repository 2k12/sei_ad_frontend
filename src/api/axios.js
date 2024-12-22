import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     // Rutas que requieren el PIN especial
//     const pathsWithPin = ["/users", "/roles", "/modules", "/permissions"];

//     // Añadir el PIN solo a las rutas que lo necesiten
//     if (
//       config.url &&
//       pathsWithPin.some((path) => config.url.startsWith(path))
//     ) {
//       config.headers["X-API-PIN"] = "45128956J";
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     console.log("Token en la solicitud:", token);  // Verifica que se pasa el token
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     const pathsWithPin = ["/users", "/roles", "/modules", "/permissions"];
//     if (
//       config.url &&
//       pathsWithPin.some((path) => config.url.startsWith(path))
//     ) {
//       config.headers["X-API-PIN"] = "45128956J";
//     }
//     console.log("Configuración de la solicitud:", config.headers);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Agregar Authorization si existe el token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // // Añadir el PIN solo a las rutas que lo necesiten
    // if (config.url && config.url.startsWith('/users')) {
    //   config.headers["X-API-PIN"] = "45128956J";
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userApi = {
  getUsers: (params) => axiosInstance.get("/users", { params }),
  updateUser: (id, userData) => axiosInstance.put(`/users/${id}`, userData),
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
};

// export const userApi = {
//   getUsers: (params) => {
//     return axiosInstance.get("/users", {
//       params,
//       headers: {
//         "X-API-PIN": "45128956J", // Agrega el PIN solo aquí
//       },
//     });
//   },
//   updateUser: (id, userData) => {
//     return axiosInstance.put(`/users/${id}`, userData, {
//       headers: {
//         "X-API-PIN": "45128956J",
//       },
//     });
//   },
//   deleteUser: (id) => {
//     return axiosInstance.delete(`/users/${id}`, {
//       headers: {
//         "X-API-PIN": "45128956J",
//       },
//     });
//   },
// };

export default axiosInstance;
