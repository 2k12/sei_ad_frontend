// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const DashboardPage = () => {
//   const navigate = useNavigate();

//   // Obtener el token del almacenamiento local
//   const token = localStorage.getItem("token");
//   if (!token) {
//     navigate("/login");
//     return null;
//   }

//   const decodedToken = JSON.parse(atob(token.split(".")[1]));
//   const permissions = decodedToken.permissions || [];

//   console.log(permissions);
  
//   // Definir colores y rutas asociadas a los permisos
//   const permissionOptions = {
//     Usuarios: { color: "blue", route: "/users" },
//     Roles: { color: "green", route: "/roles" },
//     Permisos: { color: "yellow", route: "/permissions" },
//     Modulos: { color: "purple", route: "/modules" },
//     Auditoria: { color: "red", route: "/audits" },
//   };

//   // Filtrar y mapear los permisos gestionados
//   const gestionarPermissions = permissions
//     .filter((permiso) => permiso.startsWith("Gestionar"))
//     .map((permiso) => permiso.split(" ")[1]);

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
//       <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x z-[-1]"></div>

//       <Navbar />

//       <div className="container mx-auto mt-12 p-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
//           {gestionarPermissions.map((permiso, index) => {
//             const option = permissionOptions[permiso];
//             if (!option) return null;

//             return (
//               <div
//                 key={index}
//                 className={`bg-${option.color}-500 p-6 rounded-lg shadow-lg`}
//               >
//                 <h2 className="text-white text-xl font-semibold mb-4">
//                   {permiso}
//                 </h2>
//                 <button
//                   onClick={() => navigate(option.route)}
//                   className={`w-full bg-${option.color}-700 hover:bg-${option.color}-800 text-white py-2 rounded-lg font-semibold`}
//                 >
//                   Ver {permiso.toLowerCase()}
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const navigate = useNavigate();

  // Obtener el token del almacenamiento local
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return null;
  }

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const permissions = decodedToken.permissions || [];

  // Mapeo entre los nombres de los permisos en español y las rutas en inglés
  const permissionRoutes = {
    Usuarios: "users",
    Roles: "roles",
    Permisos: "permissions",
    Modulos: "modules",
    Auditoria: "audits",
  };

  // Filtrar y mapear los permisos gestionados
  const gestionarPermissions = permissions
    .filter((permiso) => permiso.startsWith("Gestionar"))
    .map((permiso) => permiso.split(" ")[1]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x z-[-1]"></div>

      <Navbar />

      <div className="container mx-auto mt-12 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {gestionarPermissions.map((permiso, index) => {
            const route = permissionRoutes[permiso]; // Obtener la ruta correspondiente
            if (!route) return null; // Ignorar permisos no mapeados

            return (
              <div
                key={index}
                className={`bg-gray-500 p-6 rounded-lg shadow-lg`}
              >
                <h2 className="text-white text-xl font-semibold mb-4">
                  {permiso}
                </h2>
                <button
                  onClick={() => navigate(`/${route}`)} // Usar la ruta traducida
                  className={`w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold`}
                >
                  Ver {permiso.toLowerCase()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
