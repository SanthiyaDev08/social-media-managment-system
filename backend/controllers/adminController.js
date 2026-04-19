const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.username, u.email, u.role, u.is_banned, u.created_at,
            (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS postsCount
            FROM users u
            ORDER BY u.created_at DESC
        `;
        const [users] = await db.query(query);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.toggleBanUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { is_banned } = req.body; // boolean

        if (userId == req.user.id) {
            return res.status(400).json({ message: "You cannot ban yourself." });
        }

        await db.query('UPDATE users SET is_banned = ? WHERE id = ?', [is_banned, userId]);
        res.json({ message: `User has been ${is_banned ? 'banned' : 'unbanned'}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.toggleAdminRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body; // 'admin' or 'user'

        if (userId == req.user.id) {
            return res.status(400).json({ message: "You cannot change your own role." });
        }

        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
        res.json({ message: `User role has been updated to ${role}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteAnyPost = async (req, res) => {
    try {
        const { postId } = req.params;

        await db.query('DELETE FROM posts WHERE id = ?', [postId]);
        res.json({ message: 'Post deleted successfully by admin' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
