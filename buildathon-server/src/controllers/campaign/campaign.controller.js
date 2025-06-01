const Campaign = require("../../models/campaign.model");
const Influencer = require("../../models/influencer.model");
const Notification = require("../../models/notification.model");

exports.createCampaign = async (req, res, next) => {
  try {
    console.log("req.body after Multer:", req.body);

    const {
      name,
      title,
      objective,
      hashtags,
      budget,
      platforms,
      languagePreferences,
      creatorCriteria,
    } = req.body;

    if (
      !name ||
      !title ||
      !objective ||
      !budget ||
      !platforms ||
      !languagePreferences ||
      !creatorCriteria
    ) {
      console.error(
        "Missing expected fields in req.body. Multer might not be configured correctly, or frontend is not sending all data."
      );
      return res.status(400).json({ message: "Missing required form fields." });
    }

    const parsedBudget = JSON.parse(budget);
    const parsedPlatforms = JSON.parse(platforms);
    const parsedLanguagePreferences = JSON.parse(languagePreferences);
    const parsedCreatorCriteria = JSON.parse(creatorCriteria);

    const campaignData = {
      name,
      title,
      objective,
      budget: parsedBudget,
      platforms: parsedPlatforms,
      hashtags: hashtags || "",
      languagePreferences: parsedLanguagePreferences,
      creatorCriteria: parsedCreatorCriteria,
      // creator: req.user ? req.user._id : null,
    };

    const campaign = await Campaign.create(campaignData);

    await Notification.create({
      brand: req.body.name,
      sender: req.user ? req.user._id : null,
      type: "campaign_created",
      message: `📢 New Campaign Alert! "${campaign.title}" is now open for applications.`,
      link: `/campaigns/${campaign._id}`,
      relatedEntity: {
        id: campaign._id,
        type: "Campaign",
      },
      campaign: campaign._id,
    });

    return res.status(201).json({ message: "Campaign created", campaign });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getAllCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (err) {
    next(err);
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.status(200).json(campaign);
  } catch (err) {
    next(err);
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Campaign not found" });
    res.status(200).json({ message: "Campaign updated", updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Campaign not found" });
    res.status(200).json({ message: "Campaign deleted" });
  } catch (err) {
    next(err);
  }
};
