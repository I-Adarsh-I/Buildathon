const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.routes');
const userRoutes = require('./user/user.route');
const campaignRoutes = require('./campaign/campaign.route');
const aiMatchingRoutes = require("./ai/aiMatchingRoutes");
const influencerRoutes = require('./influencers/influencer.route')
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/ai', aiMatchingRoutes)
router.use('/influencers', influencerRoutes);

module.exports = router;