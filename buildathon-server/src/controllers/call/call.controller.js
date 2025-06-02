const axios = require("axios");

const AI_MATCHER_API_URL = process.env.AI_MATCHER_API_URL;
const AI_MATCHER_API_KEY = process.env.AI_MATCHER_API_KEY;

exports.makeDirectAiCall = async (req, res) => {
  const { title, description, budget } = req.body;

  console.log("logging req.body from call controller", req.body);

  if (!title || !description || !budget) {
    console.error(
      "Validation Error: 'title' is required in the request body for the AI API call."
    );
    return res.status(400).json({ error: "Product title is required." });
  }

  try {
    console.log(`Initiating direct AI API call to: ${AI_MATCHER_API_URL}`);
    console.log("Received client input for AI prompt:", {
      title,
      description,
      budget,
    });

    const aiRequestPayload = {
      prompt: `You are Jessica, an outbound price negotiator for an advertiser. You are calling to negotiate price for product promotion to the content creator. Be friendly and professional and answer all questions. Do not reveal budget (try not to exceed the budget). Product => ${title}, ${description} - ${budget}`,
      first_message:
        "Hello Creator, my name is Jessica, Is this good time to talk regarding product promotion?",
      number: "+918318396827",
    };

    await axios.post(AI_MATCHER_API_URL, aiRequestPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: AI_MATCHER_API_KEY
          ? `Bearer ${AI_MATCHER_API_KEY}`
          : undefined,
      },
    });

    res.status(200).json({
      message: "AI Matcher API call successful and matched IDs retrieved.",
    });
  } catch (error) {
    // A non-Axios related error (e.g., a coding error within this controller)
    console.error("  An unexpected, non-Axios error occurred:", error.message);
    res
      .status(500)
      .json({
        error: `An unexpected server error occurred: ${error.message}.`,
      });
  }
};
