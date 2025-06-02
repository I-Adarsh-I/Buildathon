const Influencer = require('../../models/influencer.model');
const Content = require('../../models/content.model');
const aiMatcherService = require('../../services/aiMatcher.service');

exports.getMatchedInfluencers = async (req, res, next) => {
    try {
        const { title, description, budget } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Hashtags and niche are required for AI matching." });
        }

        const criteriaToSearchInfluencersBy = {
            title,
            description,
            budget,
        }
        const matchedInfluencerIds = await aiMatcherService.matchInfluencers(criteriaToSearchInfluencersBy);

        if (!matchedInfluencerIds || matchedInfluencerIds.length === 0) {
            return res.status(200).json({ success: true, message: "No influencers matched by AI criteria.", influencers: [] });
        }

        const matchedInfluencers = await Influencer.find({ _id: { $in: matchedInfluencerIds } }).lean();

        if (matchedInfluencers.length === 0) {
            return res.status(200).json({ success: true, message: "Matched influencer IDs from AI did not correspond to existing influencers in the database.", influencers: [] });
        }

        const existingInfluencerMongoIds = matchedInfluencers.map(inf => inf._id);

        const influencerContents = await Content.find({ influencer: { $in: existingInfluencerMongoIds } }).lean();

        const influencersWithContent = matchedInfluencers.map(influencer => {
            const contentForThisInfluencer = influencerContents.filter(
                content => content.influencer.toString() === influencer._id.toString()
            );
            return {
                ...influencer,
                content: contentForThisInfluencer
            };
        });

        console.log(`Found ${influencersWithContent.length} influencers with content.`);

        res.status(200).json({
            success: true,
            message: "Influencers matched and retrieved successfully.",
            influencers: influencersWithContent
        });

    } catch (error) {
        console.error('Error in getMatchedInfluencers controller:', error);
        next(error);
    }
};