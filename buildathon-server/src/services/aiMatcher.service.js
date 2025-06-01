// const fetch = require('node-fetch');

let fetch;

// Ensure these are in your .env file
const AI_MATCHER_API_URL = process.env.AI_MATCHER_API_URL;
const AI_MATCHER_API_KEY = process.env.AI_MATCHER_API_KEY;

exports.matchInfluencers = async (criteriaToSearchInfluencersBy) => {
    if(fetch){
        const { default: fetchModule} = await import('node-fetch');
        fetch = fetchModule;
    }
    if (!AI_MATCHER_API_URL) {
        throw new Error("AI_MATCHER_API_URL is not defined in environment variables.");
    }

    try {
        // console.log(`Calling AI Matcher API at: ${AI_MATCHER_API_URL}`);
        // console.log("Sending criteria to AI:", criteriaToSearchInfluencersBy);

        // const response = await fetch(AI_MATCHER_API_URL, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': AI_MATCHER_API_KEY ? `Bearer ${AI_MATCHER_API_KEY}` : undefined,
        //         // Or 'x-api-key': AI_MATCHER_API_KEY, depending on AI API
        //     },
        //     body: JSON.stringify(criteriaToSearchInfluencersBy), // Send the criteria to the AI
        // });

        // if (!response.ok) {
        //     const errorText = await response.text();
        //     console.error(`AI Matcher API responded with status ${response.status}: ${errorText}`);
        //     throw new Error(`AI Matcher API error: ${response.status} - ${errorText}`);
        // }

        // const data = await response.json();
        // console.log("AI Matcher API response:", data);

        // if (!data || !Array.isArray(data.matchedInfluencerIds)) {
        //     throw new Error("AI Matcher API did not return expected 'matchedInfluencerIds' array.");
        // }

        const mockInfluencerIds = [
            '683b4a1dc6d6b42f75edf460',
            '683b4a1ec6d6b42f75edf47a',
            '683b4a2ac6d6b42f75edf634',
            '683b4a2bc6d6b42f75edf64e'
        ];
        console.log("--- AI Matcher Service: Returning MOCK data for testing ---");
        return mockInfluencerIds;

        // return data.matchedInfluencerIds;
    } catch (error) {
        console.error('Error in aiMatcher.service.js:', error);
        throw error;
    }
};