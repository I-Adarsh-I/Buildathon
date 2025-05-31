const express = require('express');
const router = express.Router();
const authRoutes = require('./auth/auth.routes')
const userRoutes = require('./user/user.route')

router.use('/auth', authRoutes);
router.use('/user', userRoutes)

module.exports = router;