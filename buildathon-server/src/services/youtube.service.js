const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

/**
 * Extracts a standard YouTube channel ID (starting with UC) if the input
 * string itself is a direct channel ID.
 * @param {string} input The string to check (could be a channel ID or a handle).
 * @returns {string|null} The extracted channel ID if valid, or null.
 */
function extractChannelId(input) {
  // A YouTube channel ID is 24 characters long and starts with 'UC'.
  if (
    typeof input === "string" &&
    input.length === 24 &&
    input.startsWith("UC")
  ) {
    return input;
  }
  return null;
}

/**
 * Fetches YouTube channel data based on a YouTube handle or a direct channel ID.
 * It uses the YouTube Data API's search endpoint to resolve handles to channel IDs,
 * then fetches detailed channel information.
 * @param {string} youtubeHandleOrId The YouTube handle (e.g., "@MrBeast") or a direct channel ID (e.g., "UC-lHJZR3Gqxm24_Vd_AJtfw").
 * @returns {Promise<Object|null>} An object containing channel details including uploadsPlaylistId, or null if not found/error.
 */
exports.getChannelData = async (youtubeHandleOrId) => {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not defined in environment variables.");
  }
  if (!youtubeHandleOrId) {
    throw new Error("YouTube handle or channel ID is required.");
  }

  let channelId = extractChannelId(youtubeHandleOrId);

  // If the input is not a direct channel ID, attempt to search for it using the provided handle/string
  if (!channelId) {
    console.log(
      `Input '${youtubeHandleOrId}' is not a direct channel ID. Attempting to search for channel.`
    );
    try {
      // Use the 'search' API to find the channel by its handle or custom URL
      // The 'q' parameter can take channel names, custom URLs, and handles.
      const searchUrl = `${YOUTUBE_API_BASE_URL}/search?part=id&q=${encodeURIComponent(
        youtubeHandleOrId
      )}&type=channel&key=${YOUTUBE_API_KEY}`;
      console.log(`Searching for channel with query: ${searchUrl}`);
      const searchResponse = await fetch(searchUrl);

      if (!searchResponse.ok) {
        const errorText = await searchResponse.text();
        throw new Error(
          `YouTube Search API error: ${searchResponse.status} - ${errorText}`
        );
      }
      const searchData = await searchResponse.json();
      console.log("YouTube Search API raw response:", searchData);

      if (searchData.items && searchData.items.length > 0) {
        channelId = searchData.items[0].id.channelId;
        console.log(`Found channel ID via search: ${channelId}`);
      } else {
        // If search returns no items, it means the channel wasn't found by the given handle/ID
        throw new Error(
          `YouTube channel not found for handle/ID: '${youtubeHandleOrId}'.`
        );
      }
    } catch (searchError) {
      console.error(
        "Error during YouTube channel search:",
        searchError.message
      );
      throw new Error(`Failed to find YouTube channel: ${searchError.message}`);
    }
  }

  // Now that we have a channelId (either extracted directly or found via search), fetch its full details
  try {
    // Request snippet, statistics, and contentDetails to get the uploads playlist ID
    const url = `${YOUTUBE_API_BASE_URL}/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`;
    console.log(`Fetching YouTube channel data from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `YouTube API responded with status ${response.status}: ${errorText}`
      );
      throw new Error(`YouTube API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("YouTube API raw channel response:", data);

    if (!data.items || data.items.length === 0) {
      // This case should ideally not happen if channelId was correctly found,
      // but it's a fallback for robust error handling.
      return null;
    }

    const channel = data.items[0];
    const statistics = channel.statistics;
    const snippet = channel.snippet;
    const contentDetails = channel.contentDetails;
    const profileImageUrl = snippet.thumbnails.high
      ? snippet.thumbnails.high.url
      : snippet.thumbnails.default
      ? snippet.thumbnails.default.url
      : null;

    

    return {
      channel_id: channel.id, // Actual YouTube channel ID
      channel_link: `https://www.youtube.com/channel/${channel.id}`, // Standard YouTube channel URL
      channel_name: snippet.title,
      profile_image_url: profileImageUrl,
      subscribers: parseInt(statistics.subscriberCount || "0"),
      total_views: parseInt(statistics.viewCount || "0"),
      total_videos: parseInt(statistics.videoCount || "0"),
      uploadsPlaylistId: contentDetails.relatedPlaylists.uploads, // This is crucial for fetching videos
    };
  } catch (error) {
    console.error("Error fetching YouTube channel data:", error.message);
    throw error;
  }
};

/**
 * Fetches the latest 5 videos from a given YouTube playlist (typically the uploads playlist).
 * For each video, it then fetches detailed statistics.
 * @param {string} playlistId The ID of the playlist (e.g., uploads playlist ID).
 * @returns {Promise<Array<Object>>} An array of video objects with details.
 */
exports.getLatestVideos = async (playlistId) => {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not defined in environment variables.");
  }
  if (!playlistId) {
    throw new Error("Playlist ID is required to fetch videos.");
  }

  try {
    // Step 1: Get video IDs from the playlist
    const playlistItemsUrl = `${YOUTUBE_API_BASE_URL}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=5&key=${YOUTUBE_API_KEY}`;
    console.log(`Fetching playlist items from: ${playlistItemsUrl}`);

    const playlistResponse = await fetch(playlistItemsUrl);
    if (!playlistResponse.ok) {
      const errorText = await playlistResponse.text();
      throw new Error(
        `YouTube Playlist Items API error: ${playlistResponse.status} - ${errorText}`
      );
    }
    const playlistData = await playlistResponse.json();
    console.log("YouTube API raw playlist items response:", playlistData);

    if (!playlistData.items || playlistData.items.length === 0) {
      return []; // No videos found in the playlist
    }

    const videoIds = playlistData.items.map(
      (item) => item.contentDetails.videoId
    );
    if (videoIds.length === 0) {
      return [];
    }

    const videoDetailsUrl = `${YOUTUBE_API_BASE_URL}/videos?part=snippet,statistics&id=${videoIds.join(
      ","
    )}&key=${YOUTUBE_API_KEY}`;
    console.log(`Fetching video details from: ${videoDetailsUrl}`);

    const videoDetailsResponse = await fetch(videoDetailsUrl);
    if (!videoDetailsResponse.ok) {
      const errorText = await videoDetailsResponse.text();
      throw new Error(
        `YouTube Video Details API error: ${videoDetailsResponse.status} - ${errorText}`
      );
    }
    const videoDetailsData = await videoDetailsResponse.json();
    console.log("YouTube API raw video details response:", videoDetailsData);

    const videos = videoDetailsData.items.map((video) => ({
      video_id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      published_at: video.snippet.publishedAt,
      thumbnail_default: video.snippet.thumbnails.default
        ? video.snippet.thumbnails.default.url
        : null,
      thumbnail_medium: video.snippet.thumbnails.medium
        ? video.snippet.thumbnails.medium.url
        : null,
      thumbnail_high: video.snippet.thumbnails.high
        ? video.snippet.thumbnails.high.url
        : null,
      views: parseInt(video.statistics.viewCount || "0"),
      likes: parseInt(video.statistics.likeCount || "0"),
      comments: parseInt(video.statistics.commentCount || "0"),
      video_link: `https://www.youtube.com/watch?v=${video.id}`, // Standard YouTube video URL
    }));

    return videos;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error.message);
    throw error;
  }
};
