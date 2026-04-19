import { useState, useEffect } from 'react';
import api from '../utils/api';
import PostCard from '../components/PostCard';

const Explore = () => {
    const [posts, setPosts] = useState([]);

    const fetchFeed = async () => {
        try {
            const res = await api.get('/posts/explore');
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching explore feed', error);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const handleDeletePost = async (id) => {
        try {
            await api.delete(`/posts/${id}`);
            setPosts(posts.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting post', error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Explore</h2>
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

export default Explore;
