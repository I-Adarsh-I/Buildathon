const express = require('express');
const router = express.Router();
const aiCallController = require('../../controllers/call/call.controller');

router.post('/agent-call', aiCallController.makeDirectAiCall);

module.exports = router;