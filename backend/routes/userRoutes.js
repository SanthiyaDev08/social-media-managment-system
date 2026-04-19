const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:userId', userController.getUserProfile);
router.get('/:userId/followers', userController.getFollowers);
router.get('/:userId/following', userController.getFollowing);
router.get('/:userId/mutuals', userController.getMutualFollowers);

router.post('/:userId/follow', authMiddleware, userController.followUser);
router.delete('/:userId/unfollow', authMiddleware, userController.unfollowUser);

module.exports = router;
