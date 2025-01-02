import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { RoleProvider } from "./context/RoleContext";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage"; // Importa tu página de usuarios
import RolesPage from "./pages/rolesPage";

const App = () => {
  useEffect(() => {}, []);

  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <RoleProvider>
            <Layout />
          </RoleProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

const Layout = () => {
  const { user } = useAuth();
  return (
    <div>
      {user && <Navbar />}
      <div>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />{" "}
          {/* Nueva ruta para usuarios */}
          <Route path="/roles" element={<RolesPage />} />
        </Routes>
      </div>
    </div>
  );
};
export default App;
