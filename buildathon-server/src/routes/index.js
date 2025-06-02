const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.routes');
const userRoutes = require('./user/user.route');
const campaignRoutes = require('./campaign/campaign.route');
const aiMatchingRoutes = require("./ai/aiMatchingRoutes");
const influencerRoutes = require('./influencers/influencer.route');
const callRoutes = require('./call/call.route');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/ai', aiMatchingRoutes)
router.use('/influencers', influencerRoutes);
router.use('/ai', callRoutes);

module.exports = router;