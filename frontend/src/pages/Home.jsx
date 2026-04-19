import { useState, useEffect } from 'react';
import api from '../utils/api';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');

    const fetchFeed = async () => {
        try {
            const res = await api.get('/posts/home');
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching home feed', error);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            const res = await api.post('/posts', { content });
            setPosts([res.data, ...posts]);
            setContent('');
        } catch (error) {
            console.error('Error creating post', error);
        }
    };

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
            <div className="card">
                <form onSubmit={handleCreatePost} className="flex flex-col gap-2">
                    <textarea 
                        className="input-field"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={3}
                        style={{ resize: 'none' }}
                    />
                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary">Post</button>
                    </div>
                </form>
            </div>

            <div className="flex flex-col gap-4">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
                ))}
                {posts.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                        Your feed is empty. Follow some users to see their posts!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
