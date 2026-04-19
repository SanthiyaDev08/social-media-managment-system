import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Home, Compass, User, LogOut, LogIn } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container flex justify-between items-center" style={{ height: '4rem' }}>
                <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    SocialSync
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/explore" className="flex items-center gap-2 hover:text-primary" style={{ color: 'var(--text-secondary)' }}>
                        <Compass size={20} /> <span className="hidden sm:inline">Explore</span>
                    </Link>
                    {user ? (
                        <>
                            <Link to="/home" className="flex items-center gap-2 hover:text-primary" style={{ color: 'var(--text-secondary)' }}>
                                <Home size={20} /> <span className="hidden sm:inline">Home</span>
                            </Link>
                            <Link to={`/profile/${user.id}`} className="flex items-center gap-2 hover:text-primary" style={{ color: 'var(--text-secondary)' }}>
                                <User size={20} /> <span className="hidden sm:inline">Profile</span>
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin/dashboard" className="flex items-center gap-2 hover:text-primary" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="hidden sm:inline" style={{ fontWeight: 'bold' }}>Admin</span>
                                </Link>
                            )}
                            <button onClick={handleLogout} className="flex items-center gap-2 hover:text-danger" style={{ color: 'var(--text-secondary)' }}>
                                <LogOut size={20} /> <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary flex items-center gap-2">
                            <LogIn size={20} /> Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
