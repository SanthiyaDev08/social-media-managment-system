const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
