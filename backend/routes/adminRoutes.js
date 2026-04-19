const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/ban', adminController.toggleBanUser);
router.put('/users/:userId/role', adminController.toggleAdminRole);
router.delete('/posts/:postId', adminController.deleteAnyPost);

module.exports = router;
