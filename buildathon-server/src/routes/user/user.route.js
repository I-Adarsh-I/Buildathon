const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');
const isAuthenticated = require('../../middlewares/isAuthenticated')

router.post('/create', isAuthenticated, userController.createUser);

router.get('/me', isAuthenticated, userController.getCurrentUser);

router.patch('/update', isAuthenticated, userController.updateUser);

module.exports = router;