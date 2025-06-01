const express = require('express');
const router = express.Router();
const aiMatchingController = require('../../controllers/ai/aiMatching.controller');

const isAuthenticated = require('../../middlewares/isAuthenticated');
const authorizeRole = require('../../middlewares/authorizeRole');

router.post(
    '/influencer-match',
    isAuthenticated,
    authorizeRole("admin", "user"), // Only admin or regular users (brands) can request matches
    aiMatchingController.getMatchedInfluencers
);

module.exports = router;