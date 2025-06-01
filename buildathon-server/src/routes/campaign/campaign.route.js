const express = require('express');
const router = express.Router();
const multer = require('multer');

const campaignController = require('../../controllers/campaign/campaign.controller');
const isAuthenticatd = require("../../middlewares/isAuthenticated");
const authorizeRoles = require("../../middlewares/authorizeRole");

const upload = multer();

router.post('/create', isAuthenticatd, authorizeRoles("admin", "user"), upload.none(), campaignController.createCampaign);

router.get('/all', isAuthenticatd, campaignController.getAllCampaigns);

router.get('/campaign/:id', isAuthenticatd, campaignController.getCampaignById);

router.patch('/campaign/:id', isAuthenticatd, authorizeRoles('admin', 'user'), campaignController.updateCampaign);

router.delete('/campaign/:id', isAuthenticatd, authorizeRoles('admin', 'user'), campaignController.deleteCampaign);

module.exports = router;
