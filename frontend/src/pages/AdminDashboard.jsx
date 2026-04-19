import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [selectedUserPosts, setSelectedUserPosts] = useState(null);
    const [posts, setPosts] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBanToggle = async (userId, currentStatus) => {
        try {
            await api.put(`/admin/users/${userId}/ban`, { is_banned: !currentStatus });
            fetchUsers();
        } catch (error) {
            console.error("Failed to toggle ban", error);
            alert(error.response?.data?.message || "Error");
        }
    };

    const handleRoleToggle = async (userId, currentRole) => {
        try {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            fetchUsers();
        } catch (error) {
            console.error("Failed to toggle role", error);
            alert(error.response?.data?.message || "Error");
        }
    };

    const handleViewPosts = async (userId) => {
        try {
            const res = await api.get(`/posts/user/${userId}`);
            setPosts(res.data);
            setSelectedUserPosts(userId);
        } catch (error) {
            console.error("Failed to fetch user posts", error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await api.delete(`/admin/posts/${postId}`);
            setPosts(posts.filter(p => p.id !== postId));
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    if (!user || user.role !== 'admin') {
        return <div>Access Denied</div>;
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
            
            <div className="card" style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '0.75rem' }}>ID</th>
                            <th style={{ padding: '0.75rem' }}>Username</th>
                            <th style={{ padding: '0.75rem' }}>Email</th>
                            <th style={{ padding: '0.75rem' }}>Posts</th>
                            <th style={{ padding: '0.75rem' }}>Role</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.75rem' }}>{u.id}</td>
                                <td style={{ padding: '0.75rem' }}>{u.username}</td>
                                <td style={{ padding: '0.75rem' }}>{u.email}</td>
                                <td style={{ padding: '0.75rem' }}>{u.postsCount}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{ 
                                        padding: '0.25rem 0.5rem', 
                                        borderRadius: '4px', 
                                        backgroundColor: u.role === 'admin' ? 'var(--primary-color)' : 'var(--surface-hover)' 
                                    }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{ color: u.is_banned ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                                        {u.is_banned ? 'Banned' : 'Active'}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                    {u.id !== user.id && (
                                        <>
                                            <button 
                                                className={`btn ${u.is_banned ? 'btn-outline' : 'btn-primary'}`} 
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: u.is_banned ? 'transparent' : 'var(--danger-color)' }}
                                                onClick={() => handleBanToggle(u.id, u.is_banned)}
                                            >
                                                {u.is_banned ? 'Unban' : 'Ban'}
                                            </button>
                                            <button 
                                                className="btn btn-outline" 
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                onClick={() => handleRoleToggle(u.id, u.role)}
                                            >
                                                {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                            </button>
                                        </>
                                    )}
                                    <button 
                                        className="btn btn-outline" 
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                        onClick={() => handleViewPosts(u.id)}
                                    >
                                        View Posts
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUserPosts !== null && (
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                        Posts from User #{selectedUserPosts}
                    </h2>
                    <div className="flex flex-col gap-4" style={{ maxWidth: '600px' }}>
                        {posts.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>This user has no posts.</p>
                        ) : (
                            posts.map(post => (
                                <div key={post.id} style={{ position: 'relative' }}>
                                    <PostCard post={post} onDelete={handleDeletePost} />
                                    <button 
                                        onClick={() => handleDeletePost(post.id)}
                                        className="btn btn-primary"
                                        style={{ position: 'absolute', top: '1rem', right: '3rem', backgroundColor: 'var(--danger-color)', padding: '0.25rem 0.5rem', fontSize: '0.8rem', zIndex: 10 }}
                                    >
                                        Delete as Admin
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
