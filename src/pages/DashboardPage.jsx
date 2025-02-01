import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return null;
  }

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const permissions = decodedToken.permissions || [];

  console.log(permissions);

  const permissionRoutes = {
    Usuarios: "users",
    Roles: "roles",
    Permisos: "permissions",
    Modulos: "modules",
    Auditoria: "audits",
  };

  const permissionDisplayNames = {
    Usuarios: "Usuarios",
    Roles: "Roles",
    Permisos: "Permisos",
    Modulos: "Módulos",
    Auditoria: "Auditoría",
  };

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
            const route = permissionRoutes[permiso];
            const displayName = permissionDisplayNames[permiso] || permiso; 
            if (!route) return null;

            return (
              <div
                key={index}
                className={`bg-gray-500 p-6 rounded-lg shadow-lg`}
              >
                <h2 className="text-white text-xl font-semibold mb-4">
                  {displayName}
                </h2>
                <button
                  onClick={() => navigate(`/${route}`)}
                  className={`w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold`}
                >
                  Ver {displayName.toLowerCase()}
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
