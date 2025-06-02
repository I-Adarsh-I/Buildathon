const axios = require("axios");

// Ensure these are in your .env file
const AI_MATCHER_API_URL = process.env.AI_MATCHER_API_URL;
const AI_MATCHER_API_KEY = process.env.AI_MATCHER_API_KEY;

// exports.matchInfluencers = async (criteriaToSearchInfluencersBy) => {

//     if (!AI_MATCHER_API_URL) {
//         throw new Error("AI_MATCHER_API_URL is not defined in environment variables.");
//     }

//     try {
//         console.log(`Calling AI Matcher API at: ${AI_MATCHER_API_URL}`);
//         console.log("Sending criteria to AI:", criteriaToSearchInfluencersBy);

//          const aiRequestPayload = {
//         "prompt": `You are Jessica, an outbound price negotiator for an advertiser. You are calling to negotiate price for product promotion to the content creator. Be friendly and professional and answer all questions. Do not reveal budget (try not to exceed the budget). Product => ${criteriaToSearchInfluencersBy.title}, ${criteriaToSearchInfluencersBy.description} - ${criteriaToSearchInfluencersBy.budget}`,
//         "first_message": "Hello Creator, my name is Jessica, Is this good time to talk regarding product promotion?",
//         "number": "+918318396827"
//     };

//     // return console.log(aiRequestPayload)

//         const response = await axios.post(AI_MATCHER_API_URL, aiRequestPayload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': AI_MATCHER_API_KEY ? `Bearer ${AI_MATCHER_API_KEY}` : undefined,
//             },
//         });

//         if (!response.ok) {
//             console.error(`AI Matcher API responded with status ${response.status}: ${errorText}`);
//             throw new Error(`AI Matcher API error: ${response.status} - ${errorText}`);
//         }

//         const data = await response.json();
//         console.log("AI Matcher API response:", data);

//         if (!data || !Array.isArray(data.matchedInfluencerIds)) {
//             throw new Error("AI Matcher API did not return expected 'matchedInfluencerIds' array.");
//         }

//         console.log("--- AI Matcher Service: Returning MOCK data for testing ---");
//         return mockInfluencerIds;

//         // return data.matchedInfluencerIds;
//     } catch (error) {
//         console.error('Error in aiMatcher.service.js:', error);
//         throw error;
//     }
// };

exports.matchInfluencers = async (criteriaToSearchInfluencersBy) => {
  if (!AI_MATCHER_API_URL) {
    throw new Error(
      "AI_MATCHER_API_URL is not defined in environment variables. Cannot proceed with AI Matcher API call."
    );
  }

  try {
    console.log(`Calling AI Matcher API at: ${AI_MATCHER_API_URL}`);
    console.log("Sending criteria to AI:", criteriaToSearchInfluencersBy);

    // Construct the payload to be sent to the AI service.
    const aiRequestPayload = {
      prompt: `You are Jessica, an outbound price negotiator for an advertiser. You are calling to negotiate price for product promotion to the content creator. Be friendly and professional and answer all questions. Do not reveal budget (try not to exceed the budget). Product => ${criteriaToSearchInfluencersBy.title}, ${criteriaToSearchInfluencersBy.description} - ${criteriaToSearchInfluencersBy.budget}`,
      first_message:
        "Hello Creator, my name is Jessica, Is this good time to talk regarding product promotion?",
      number: "+918318396827",
    };

    const response = await axios.post(AI_MATCHER_API_URL, aiRequestPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: AI_MATCHER_API_KEY
          ? `Bearer ${AI_MATCHER_API_KEY}`
          : undefined,
      },
    });

    const data = response.data;
    console.log("AI Matcher API response:", data);

    const mockInfluencerIds = [
        '683b4a423e772afa0dc1c59a',
        '683cb6431504e68b9d527ed3',
        '683b4a413e772afa0dc1c580',
        '683b4a413e772afa0dc1c566'
    ];

    return mockInfluencerIds;
  } catch (error) {
    console.error("  A non-Axios error occurred:", error.message);
    throw error; // Re-throw the original error.
  }
};
