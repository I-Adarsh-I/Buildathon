const express = require('express');
const router = express.Router();
const multer = require('multer');

const campaignController = require('../../controllers/campaign/campaign.controller');
const isAuthenticatd = require("../../middlewares/isAuthenticated");
const authorizeRoles = require("../../middlewares/authorizeRole");

const upload = multer();

router.post('/create',  upload.none(), campaignController.createCampaign);

router.get('/all', campaignController.getAllCampaigns);

router.get('/campaign/:id', campaignController.getCampaignById);

router.patch('/campaign/:id', campaignController.updateCampaign);

router.delete('/campaign/:id', campaignController.deleteCampaign);

module.exports = router;

// , authorizeRoles("admin", "user"),
// , authorizeRoles('admin', 'user'),
// , authorizeRoles('admin', 'user'),
// isAuthenticatd,
// isAuthenticatd,
// isAuthenticatd,
// isAuthenticatd,
// isAuthenticatd,