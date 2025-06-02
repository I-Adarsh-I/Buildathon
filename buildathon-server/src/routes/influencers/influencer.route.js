const express = require("express");
const router = express.Router();
const influencerController = require("../../controllers/influencer/influencer.controller");

const isAuthenticated = require("../../middlewares/isAuthenticated");
const authorizeRole = require("../../middlewares/authorizeRole");

router.post(
  "/influencer/onboard",
  // isAuthenticated,
  // authorizeRole("admin", "user"),
  influencerController.onboardInfluencer
);

router.get(
  "/all",
  // isAuthenticated,
  // authorizeRole("admin", "user"),
  influencerController.getAllInfluencersWithContent
);

router.get(
  "/influencer/:id",
  // isAuthenticated,
  // authorizeRole("admin", "user"),
  influencerController.getInfluencerByIdWithContent
);

module.exports = router;
