import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import CommentSection from './CommentSection';
import { Heart, MessageCircle, Share2, Trash2, Edit2, X, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, onDelete }) => {
    const { user } = useContext(AuthContext);
    const [isLiked, setIsLiked] = useState(post.isLiked === 1);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [currentContent, setCurrentContent] = useState(post.content);

    const handleUpdate = async () => {
        if (!editContent.trim()) return;
        try {
            await api.put(`/posts/${post.id}`, { content: editContent });
            setCurrentContent(editContent);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update post", error);
        }
    };

    const handleLike = async () => {
        if (!user) return;
        try {
            if (isLiked) {
                await api.delete(`/interactions/${post.id}/unlike`);
                setLikeCount(prev => prev - 1);
            } else {
                await api.post(`/interactions/${post.id}/like`);
                setLikeCount(prev => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Like interaction failed", error);
        }
    };

    const handleShare = async () => {
        if (!user) return;
        try {
            await api.post(`/interactions/${post.id}/share`);
            alert("Post shared!");
        } catch (error) {
            console.error("Share interaction failed", error);
        }
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                <Link to={`/profile/${post.user_id}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {post.username}
                </Link>
                <div className="flex items-center gap-4">
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </span>
                    {user && user.id === post.user_id && (
                        <div className="flex gap-2">
                            <button onClick={() => {
                                setIsEditing(!isEditing);
                                setEditContent(currentContent);
                            }} style={{ color: 'var(--text-secondary)' }}>
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => onDelete(post.id)} style={{ color: 'var(--danger-color)' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="flex flex-col gap-2" style={{ marginBottom: '1.5rem' }}>
                    <textarea 
                        className="input-field" 
                        value={editContent} 
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        style={{ resize: 'none' }}
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                            <X size={14} /> Cancel
                        </button>
                        <button onClick={handleUpdate} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                            <Check size={14} /> Save
                        </button>
                    </div>
                </div>
            ) : (
                <p style={{ marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>{currentContent}</p>
            )}

            <div className="flex items-center gap-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button 
                    onClick={handleLike} 
                    className="flex items-center gap-2" 
                    style={{ color: isLiked ? 'var(--danger-color)' : 'var(--text-secondary)' }}
                >
                    <Heart size={20} fill={isLiked ? 'var(--danger-color)' : 'none'} />
                    <span>{likeCount}</span>
                </button>
                <button 
                    onClick={() => setShowComments(!showComments)} 
                    className="flex items-center gap-2" 
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <MessageCircle size={20} />
                    <span>{post.commentCount}</span>
                </button>
                <button 
                    onClick={handleShare} 
                    className="flex items-center gap-2" 
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <Share2 size={20} />
                    <span>{post.shareCount}</span>
                </button>
            </div>

            {showComments && <CommentSection postId={post.id} />}
        </div>
    );
};

export default PostCard;
