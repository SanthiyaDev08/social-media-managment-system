const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:postId/comments', interactionController.getComments);

router.use(authMiddleware);
router.post('/:postId/like', interactionController.likePost);
router.delete('/:postId/unlike', interactionController.unlikePost);
router.post('/:postId/comment', interactionController.addComment);
router.post('/:postId/share', interactionController.sharePost);

module.exports = router;
