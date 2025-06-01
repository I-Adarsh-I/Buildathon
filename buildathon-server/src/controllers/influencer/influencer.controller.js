const Influencer = require("../../models/influencer.model");
const Content = require("../../models/content.model");
const attachContentToInfluencers = require("../../utils/influencer.helper");
const youtubeService = require("../../services/youtube.service");

exports.onboardInfluencer = async (req, res, next) => {
  const { influencerName, influencerEmail, youtubeLink } = req.body;

  if (!influencerName || !influencerEmail || !youtubeLink) {
    return res
      .status(400)
      .json({
        error: "Influencer name, email, and YouTube link are required.",
      });
  }

  try {
    // Fetch channel data from YouTube
    const channelData = await youtubeService.getChannelData(youtubeLink);

    if (!channelData) {
      return res
        .status(404)
        .json({ error: "YouTube channel not found or invalid link." });
    }

    // Check if an influencer with this name already exists
    let influencer = await Influencer.findOne({ name: influencerName });

    if (influencer) {
      // If influencer exists, update their YouTube info and email
      influencer.contact_email = influencerEmail;
      influencer.youtube = {
        channel_link: channelData.channel_link,
        channel_name: channelData.channel_name,
        profile_image: channelData.profile_image_url,
        subscribers: channelData.subscribers,
        total_views: channelData.total_views,
        total_videos: channelData.total_videos,
      };
      // Ensure instagram field is present, even if empty, as per schema
      if (!influencer.instagram) {
        influencer.instagram = {};
      }
      await influencer.save();
      console.log(`Updated existing influencer: ${influencerName}`);
    } else {
      // Create a new Influencer document
      influencer = new Influencer({
        name: influencerName,
        contact_email: influencerEmail,
        profile_image: channelData.profile_image_url,
        youtube: {
          channel_link: channelData.channel_link,
          channel_name: channelData.channel_name,
          subscribers: channelData.subscribers,
          total_views: channelData.total_views,
          total_videos: channelData.total_videos,
        },
        instagram: {}, // Initialize instagram as an empty object as per schema
      });
      await influencer.save();
      console.log(`Created new influencer: ${influencerName}`);
    }

    // Fetch latest videos using the uploads playlist ID from channel data
    const latestVideos = await youtubeService.getLatestVideos(
      channelData.uploadsPlaylistId
    );

    await Content.deleteMany({
      influencer: influencer._id,
      contentType: "video",
    });

    // Save latest YouTube posts to the Content model
    const savedContents = [];
    for (const video of latestVideos) {
      const content = new Content({
        influencer: influencer._id,
        contentType: "video",
        title: video.title,
        mediaId: video.video_id,
        publishedAt: video.published_at,
        views: video.views,
        likes: video.likes,
        comments: video.comments,
        url: video.video_link,
        thumbnails: {
          default: video.thumbnail_default,
          medium: video.thumbnail_medium,
          high: video.thumbnail_high,
        },
      });
      await content.save();
      savedContents.push(content);
    }
    console.log(
      `Saved ${savedContents.length} latest YouTube posts for ${influencerName}`
    );

    // Prepare the response data (similar to before, but now confirming DB save)
    const onboardingResult = {
      influencer_info: {
        _id: influencer._id,
        name: influencer.name,
        email: influencer.contact_email,
        youtube_link: youtubeLink,
      },
      youtube_channel_info: {
        channel_id: channelData.channel_id,
        channel_name: channelData.channel_name,
        channel_link: channelData.channel_link,
        subscribers: channelData.subscribers,
        total_views: channelData.total_views,
        total_videos: channelData.total_videos,
      },
      latest_youtube_posts: savedContents.map((c) => ({
        title: c.title,
        url: c.url,
        views: c.views,
        likes: c.likes,
        comments: c.comments,
        publishedAt: c.publishedAt,
        thumbnails: c.thumbnails,
      })),
    };

    res.status(200).json({
      message: "Influencer onboarded and data saved successfully!",
      data: onboardingResult,
    });
  } catch (err) {
    console.error("Error during influencer onboarding:", err.message);
    next(err);
  }
};

exports.getAllInfluencersWithContent = async (req, res, next) => {
  try {
    const allInfluencers = await Influencer.find({}).lean();

    const influencersWithContent = await attachContentToInfluencers(
      allInfluencers
    );

    res.status(200).json({
      success: true,
      message: "All influencers retrieved successfully with their content.",
      influencers: influencersWithContent,
    });
  } catch (error) {
    console.error("Error in getAllInfluencersWithContent:", error);
    next(error);
  }
};

exports.getInfluencerByIdWithContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const influencer = await Influencer.findById(id).lean();

    if (!influencer) {
      return res
        .status(404)
        .json({ success: false, message: "Influencer not found." });
    }

    const influencerWithContent = (
      await attachContentToInfluencers([influencer])
    )[0];

    res.status(200).json({
      success: true,
      message: "Influencer retrieved successfully with their content.",
      influencer: influencerWithContent,
    });
  } catch (error) {
    console.error("Error in getInfluencerByIdWithContent:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Influencer ID format." });
    }
    next(error);
  }
};
