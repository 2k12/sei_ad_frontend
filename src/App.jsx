import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { RoleProvider } from "./context/RoleContext";
import { PermissionProvider } from "./context/PermissionContext";
import { ModuleProvider } from "./context/ModuleContext";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import ProfileUserPage from './pages/ProfileUserPage';
import PermissionsPage from './pages/PermissionsPage';
import PermissionDetailPage from './pages/PermissionDetailPage';
import RolesPage from "./pages/RolesPage";
import ModulePage from "./pages/ModulePage";
import { AuditProvider } from "./context/AuditContext";
import AuditsPage from "./pages/AuditPage";

import ProtectedRoute from "./components/ProtectedRoutes";

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  useEffect(() => { }, []);

  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <RoleProvider>
            <AuditProvider>
              <PermissionProvider>
                <ModuleProvider>
                  <Layout />
                </ModuleProvider>
              </PermissionProvider>
            </AuditProvider>
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
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredPermission="Gestionar Usuarios">
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:userId"
            element={
              <ProtectedRoute requiredPermission="Gestionar Usuarios">
                <ProfileUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permissions"
            element={
              <ProtectedRoute requiredPermission="Gestionar Usuarios">
                <PermissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permissions/:permissionId"
            element={
              <ProtectedRoute requiredPermission="Gestionar Usuarios">
                <PermissionDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute requiredPermission="Gestionar Usuarios">
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audits"
            element={
              <ProtectedRoute requiredPermission="Gestionar Usuarios">
                <AuditsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modules"
            element={
              <ProtectedRoute requiredPermission="Gestionar Usuarios">
                <ModulePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};
export default App;
