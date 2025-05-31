const Campaign = require("../../models/campaign.model");

exports.createCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.create(req.body);
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
