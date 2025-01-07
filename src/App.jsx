import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { RoleProvider } from "./context/RoleContext";
import { PermissionProvider } from "./context/PermissionContext";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import ProfileUserPage from "./pages/ProfileUserPage";
import { Navigate } from "react-router-dom";
import PermissionsPage from "./pages/PermissionsPage";
import PermissionDetailPage from "./pages/PermissionDetailPage";
// import Breadcrumbs from './components/Breadcrumbs';
import RolesPage from "./pages/rolesPage";
import { AuditProvider } from "./context/AuditContext";
import AuditsPage from "./pages/auditPage";

const App = () => {
  useEffect(() => {}, []);

  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <RoleProvider>
            <AuditProvider>
              <PermissionProvider>
                <Layout />
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
        {/* <Breadcrumbs /> */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />{" "}
          <Route path="/users/:userId" element={<ProfileUserPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route
            path="/permissions/:permissionId"
            element={<PermissionDetailPage />}
          />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/audits" element={<AuditsPage />} />
        </Routes>
      </div>
    </div>
  );
};
export default App;
