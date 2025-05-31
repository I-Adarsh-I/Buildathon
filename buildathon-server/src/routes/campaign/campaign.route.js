const express = require('express');
const router = express.Router();

const campaignController = require('../../controllers/campaign/campaign.controller');
const isAuthenticatd = require("../../middlewares/isAuthenticated");
const authorizeRoles = require("../../middlewares/authorizeRole");

router.post('/create', isAuthenticatd, authorizeRoles("admin", "user"), campaignController.createCampaign);

router.get('/all', isAuthenticatd, campaignController.getAllCampaigns);

router.get('/campaign/:id', isAuthenticatd, campaignController.getCampaignById);

router.patch('/campaign/:id', isAuthenticatd, authorizeRoles('admin', 'user'), campaignController.updateCampaign);

router.delete('/campaign/:id', isAuthenticatd, authorizeRoles('admin', 'user'), campaignController.deleteCampaign);

module.exports = router;
