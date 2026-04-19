import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(`/interactions/${postId}/comments`);
                setComments(res.data);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            }
        };
        fetchComments();
    }, [postId]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            const res = await api.post(`/interactions/${postId}/comment`, { text });
            setComments([...comments, res.data]);
            setText('');
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    return (
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            {user && (
                <form onSubmit={handleAddComment} className="flex gap-2" style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Add a comment..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Post</button>
                </form>
            )}

            <div className="flex flex-col gap-2">
                {comments.map((comment) => (
                    <div key={comment.id} style={{ padding: '0.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem' }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{comment.username}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                        </div>
                        <p style={{ fontSize: '0.95rem' }}>{comment.comment_text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
