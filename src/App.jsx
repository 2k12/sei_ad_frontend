import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import ProfileUserPage from './pages/ProfileUserPage'; 
import { Navigate } from 'react-router-dom';
// import Breadcrumbs from './components/Breadcrumbs';

const App = () => {


  useEffect(() => {
  }, []);

  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <Layout />
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
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:userId" element={<ProfileUserPage />} />
        </Routes>
      </div>
    </div>
  );
};
export default App;
