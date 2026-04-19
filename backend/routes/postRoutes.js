const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public route (with optional auth for interaction state)
router.get('/explore', postController.getExploreFeed);
router.get('/user/:userId', postController.getUserPosts);

// Protected routes
router.use(authMiddleware);
router.get('/home', postController.getHomeFeed);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
