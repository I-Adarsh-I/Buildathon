const express = require('express');
const router = express.Router();
const authRoutes = require('./auth/auth.routes');
const userRoutes = require('./user/user.route');
const campaignRoutes = require('./campaign/campaign.route');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/campaigns', campaignRoutes)

module.exports = router;