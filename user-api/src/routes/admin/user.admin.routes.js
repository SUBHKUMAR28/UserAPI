const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/user.admin.controller');

router.get('/', userController.getAllUsers);
router.put('/:id/status', userController.updateUserStatus);
router.put('/:id/profile', userController.updateUserProfile);

module.exports = router;