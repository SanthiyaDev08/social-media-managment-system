const db = require('../config/db');

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user ? req.user.id : 0;

        const [users] = await db.query('SELECT id, username, created_at FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const user = users[0];

        const [followers] = await db.query('SELECT COUNT(*) as count FROM follows WHERE following_id = ?', [userId]);
        const [following] = await db.query('SELECT COUNT(*) as count FROM follows WHERE follower_id = ?', [userId]);
        const [posts] = await db.query('SELECT COUNT(*) as count FROM posts WHERE user_id = ?', [userId]);
        
        let isFollowing = false;
        if (currentUserId) {
            const [followCheck] = await db.query('SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?', [currentUserId, userId]);
            isFollowing = followCheck.length > 0;
        }

        res.json({
            ...user,
            followersCount: followers[0].count,
            followingCount: following[0].count,
            postsCount: posts[0].count,
            isFollowing
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.followUser = async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.params.userId;

        if (followerId == followingId) return res.status(400).json({ message: 'Cannot follow yourself' });

        await db.query('INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
        res.json({ message: 'Successfully followed user' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.params.userId;

        await db.query('DELETE FROM follows WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
        res.json({ message: 'Successfully unfollowed user' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const userId = req.params.userId;
        const query = `
            SELECT u.id, u.username 
            FROM follows f 
            JOIN users u ON f.follower_id = u.id 
            WHERE f.following_id = ?
        `;
        const [followers] = await db.query(query, [userId]);
        res.json(followers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const userId = req.params.userId;
        const query = `
            SELECT u.id, u.username 
            FROM follows f 
            JOIN users u ON f.following_id = u.id 
            WHERE f.follower_id = ?
        `;
        const [following] = await db.query(query, [userId]);
        res.json(following);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMutualFollowers = async (req, res) => {
    try {
        const userId = req.params.userId;
        const query = `
            SELECT u.id, u.username
            FROM users u
            JOIN follows f1 ON u.id = f1.following_id
            JOIN follows f2 ON u.id = f2.follower_id
            WHERE f1.follower_id = ? AND f2.following_id = ?
        `;
        const [mutuals] = await db.query(query, [userId, userId]);
        res.json(mutuals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
