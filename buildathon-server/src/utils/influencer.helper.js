const Content = require('../models/content.model');

const attachContentToInfluencers = async (influencers) => {
  if (!influencers || influencers.length === 0) {
    return [];
  }

  const influencerIds = influencers.map((inf) => inf._id);

  // Fetch all content related to these influencers
  const allContent = await Content.find({
    influencer: { $in: influencerIds },
  }).lean();

  // Map content back to their respective influencers
  const influencersWithContent = influencers.map((influencer) => {
    const contentForThisInfluencer = allContent.filter(
      (content) => content.influencer.toString() === influencer._id.toString()
    );
    return {
      ...influencer,
      content: contentForThisInfluencer,
    };
  });

  return influencersWithContent;
};

module.exports = attachContentToInfluencers