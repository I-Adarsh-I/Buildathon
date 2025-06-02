const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user/user.controller');
const isAuthenticated = require('../../middlewares/isAuthenticated')

router.post('/create', userController.createUser);

router.get('/me', userController.getCurrentUser);

router.patch('/update',  userController.updateUser);

module.exports = router;

// isAuthenticated,