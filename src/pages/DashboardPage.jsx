import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
    const navigate = useNavigate();
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/login");
      return null;
    }
  
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />
  
        <div className="container mx-auto mt-4 p-4">
          {/* <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bienvenido al Dashboard
          </h1> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            <div className="bg-blue-500 p-4 rounded shadow">
              <h2 className="text-white text-lg">Usuarios</h2>
              <button
                onClick={() => navigate("/usuarios")}
                className="text-white mt-2 block w-full bg-blue-700 hover:bg-blue-800 py-1 rounded"
              >
                Ver usuarios
              </button>
            </div>
            <div className="bg-green-500 p-4 rounded shadow">
              <h2 className="text-white text-lg">Roles</h2>
              <button
                onClick={() => navigate("/roles")}
                className="text-white mt-2 block w-full bg-green-700 hover:bg-green-800 py-1 rounded"
              >
                Ver roles
              </button>
            </div>
            <div className="bg-yellow-500 p-4 rounded shadow">
              <h2 className="text-white text-lg">Permisos</h2>
              <button
                onClick={() => navigate("/permisos")}
                className="text-white mt-2 block w-full bg-yellow-700 hover:bg-yellow-800 py-1 rounded"
              >
                Ver permisos
              </button>
            </div>
            <div className="bg-purple-500 p-4 rounded shadow">
              <h2 className="text-white text-lg">Módulos</h2>
              <button
                onClick={() => navigate("/modulos")}
                className="text-white mt-2 block w-full bg-purple-700 hover:bg-purple-800 py-1 rounded"
              >
                Ver módulos
              </button>
            </div>
            <div className="bg-red-500 p-4 rounded shadow">
              <h2 className="text-white text-lg">Auditoría</h2>
              <button
                onClick={() => navigate("/auditoria")}
                className="text-white mt-2 block w-full bg-red-700 hover:bg-red-800 py-1 rounded"
              >
                Ver auditoría
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default DashboardPage;
  