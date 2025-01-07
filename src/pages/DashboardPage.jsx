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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x z-[-1]"></div>

      <Navbar />

      <div className="container mx-auto mt-12 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="bg-blue-500 p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-xl font-semibold mb-4">Usuarios</h2>
            <button
              onClick={() => navigate("/users")}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold "
            >
              Ver usuarios
            </button>
          </div>
          <div className="bg-green-500 p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-xl font-semibold mb-4">Roles</h2>
            <button
              onClick={() => navigate("/roles")}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg font-semibold "
            >
              Ver roles
            </button>
          </div>
          <div className="bg-yellow-500 p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-xl font-semibold mb-4">Permisos</h2>
            <button
              onClick={() => navigate("/permissions")}
              className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-2 rounded-lg font-semibold "
            >
              Ver permisos
            </button>
          </div>
          <div className="bg-purple-500 p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-xl font-semibold mb-4">Módulos</h2>
            <button
              onClick={() => navigate("/modules")}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg font-semibold "
            >
              Ver módulos
            </button>
          </div>
          <div className="bg-red-500 p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-xl font-semibold mb-4">Auditoría</h2>
            <button
              onClick={() => navigate("/audits")}
              className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-semibold "
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
