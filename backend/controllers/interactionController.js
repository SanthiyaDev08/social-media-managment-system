const db = require('../config/db');

exports.likePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        await db.query('INSERT IGNORE INTO interactions (user_id, post_id, type) VALUES (?, ?, ?)', [userId, postId, 'like']);
        res.json({ message: 'Post liked' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        await db.query('DELETE FROM interactions WHERE user_id = ? AND post_id = ? AND type = ?', [userId, postId, 'like']);
        res.json({ message: 'Post unliked' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;
        const { text } = req.body;

        if (!text) return res.status(400).json({ message: 'Comment text is required' });

        const [result] = await db.query(
            'INSERT INTO interactions (user_id, post_id, type, comment_text) VALUES (?, ?, ?, ?)', 
            [userId, postId, 'comment', text]
        );

        const [newComment] = await db.query(`
            SELECT i.*, u.username 
            FROM interactions i 
            JOIN users u ON i.user_id = u.id 
            WHERE i.id = ?`, [result.insertId]);

        res.status(201).json(newComment[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const query = `
            SELECT i.*, u.username 
            FROM interactions i 
            JOIN users u ON i.user_id = u.id 
            WHERE i.post_id = ? AND i.type = 'comment'
            ORDER BY i.created_at ASC
        `;
        const [comments] = await db.query(query, [postId]);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.sharePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        await db.query('INSERT INTO interactions (user_id, post_id, type) VALUES (?, ?, ?)', [userId, postId, 'share']);
        res.json({ message: 'Post shared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
