import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function AppContent() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  // Hide navbar only on auth routes
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin/login';
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: isAdminRoute ? '1000px' : '800px' }}>
        <Routes>
          <Route path="/" element={!user ? <Navigate to="/explore" /> : <Navigate to="/home" />} />
          <Route path="/home" element={!user ? <Navigate to="/login" /> : <Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile/:id" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/login" />} />
          <Route path="/admin/login" element={!user ? <AdminLogin /> : <Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
