const db = require('../config/db');

// Create post
exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required' });

        const [result] = await db.query('INSERT INTO posts (user_id, content) VALUES (?, ?)', [req.user.id, content]);
        
        const [newPost] = await db.query(`
            SELECT p.*, u.username 
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = ?`, [result.insertId]);

        res.status(201).json(newPost[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get explore feed (all posts)
exports.getExploreFeed = async (req, res) => {
    try {
        const query = `
            SELECT p.*, u.username,
            (SELECT COUNT(*) FROM interactions WHERE post_id = p.id AND type = 'like') AS likeCount,
            (SELECT COUNT(*) FROM interactions WHERE post_id = p.id AND type = 'comment') AS commentCount,
            (SELECT COUNT(*) FROM interactions WHERE post_id = p.id AND type = 'share') AS shareCount,
            EXISTS(SELECT 1 FROM interactions WHERE post_id = p.id AND user_id = ? AND type = 'like') AS isLiked
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
            LIMIT 50
        `;
        const [posts] = await db.query(query, [req.user ? req.user.id : 0]);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get personal feed (followed users + own posts)
exports.getHomeFeed = async (req, res) => {
    try {
        const query = `
            SELECT p.*, u.username,
            (SELECT COUNT(*) FROM interactions WHERE post_id = p.id AND type = 'like') AS likeCount,
            (SELECT COUNT(*) FROM interactions WHERE post_id = p.id AND type = 'comment') AS commentCount,
            (SELECT COUNT(*) FROM interactions WHERE post_id = p.id AND type = 'share') AS shareCount,
            EXISTS(SELECT 1 FROM interactions WHERE post_id = p.id AND user_id = ? AND type = 'like') AS isLiked
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ? OR p.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)
            ORDER BY p.created_at DESC
            LIMIT 50
        `;
        const [posts] = await db.query(query, [req.user.id, req.user.id, req.user.id]);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user posts
exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user ? req.user.id : 0;
        const query = `
            SELECT p.*, u.username,
            (SELECT COUNT(*) FROM interactions WHERE post_id = p.id AND type = 'like') AS likeCount,
            (SELECT COUNT(*) FROM interactions WHERE post_id = p.id AND type = 'comment') AS commentCount,
            (SELECT COUNT(*) FROM interactions WHERE post_id = p.id AND type = 'share') AS shareCount,
            EXISTS(SELECT 1 FROM interactions WHERE post_id = p.id AND user_id = ? AND type = 'like') AS isLiked
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `;
        const [posts] = await db.query(query, [currentUserId, userId]);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.id;

        const [post] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
        if (post.length === 0) return res.status(404).json({ message: 'Post not found' });
        if (post[0].user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        await db.query('UPDATE posts SET content = ? WHERE id = ?', [content, postId]);
        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const [post] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
        if (post.length === 0) return res.status(404).json({ message: 'Post not found' });
        if (post[0].user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        await db.query('DELETE FROM posts WHERE id = ?', [postId]);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
