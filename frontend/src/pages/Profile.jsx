import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { UserPlus, UserMinus, Users } from 'lucide-react';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);

    const fetchProfileData = async () => {
        try {
            const [profileRes, postsRes] = await Promise.all([
                api.get(`/users/${id}`),
                api.get(`/posts/user/${id}`)
            ]);
            setProfile(profileRes.data);
            setPosts(postsRes.data);
        } catch (error) {
            console.error('Error fetching profile', error);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [id]);

    const handleFollow = async () => {
        if (!currentUser) return;
        try {
            if (profile.isFollowing) {
                await api.delete(`/users/${id}/unfollow`);
                setProfile(prev => ({ ...prev, isFollowing: false, followersCount: prev.followersCount - 1 }));
            } else {
                await api.post(`/users/${id}/follow`);
                setProfile(prev => ({ ...prev, isFollowing: true, followersCount: prev.followersCount + 1 }));
            }
        } catch (error) {
            console.error("Follow error", error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await api.delete(`/posts/${postId}`);
            setPosts(posts.filter(p => p.id !== postId));
        } catch (error) {
            console.error('Error deleting post', error);
        }
    };

    if (!profile) return <div>Loading...</div>;

    const isOwnProfile = currentUser && currentUser.id === parseInt(id);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
                    {profile.username.charAt(0).toUpperCase()}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{profile.username}</h2>
                
                <div className="flex gap-4" style={{ marginBottom: '1.5rem' }}>
                    <div className="flex flex-col items-center">
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{profile.postsCount}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Posts</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{profile.followersCount}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{profile.followingCount}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Following</span>
                    </div>
                </div>

                {!isOwnProfile && currentUser && (
                    <button 
                        onClick={handleFollow} 
                        className={`btn ${profile.isFollowing ? 'btn-outline' : 'btn-primary'} flex items-center gap-2`}
                    >
                        {profile.isFollowing ? (
                            <><UserMinus size={18} /> Unfollow</>
                        ) : (
                            <><UserPlus size={18} /> Follow</>
                        )}
                    </button>
                )}
            </div>

            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} /> Posts
            </h3>
            
            <div className="flex flex-col gap-4">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
                ))}
                {posts.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                        No posts yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
