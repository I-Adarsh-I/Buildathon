# Architecture & DFD for InfluencerFlow

This system connects **advertisers** with **content creators (influencers)** using data-driven recommendations and automated voice negotiation.

![InfluencerFlow Architecture](https://github.com/I-Adarsh-I/Buildathon/raw/main/images/Architecture.png)

---

## 🧑‍💻 Actors

- **Content Creator**: Registers on the platform.
- **Advertiser**: Creates promotional campaigns and selects influencers.
- **Voice Agent**: Uses **ElevenLabs + Twilio** to contact influencers via phone.

---

## 🧠 Core Components & Data Flow

### 1. Influencer Data Engine
- Triggered when a content creator **registers**.
- Collects and stores creator metadata (e.g., profile, engagement metrics).
- Sends data to the **Content Classifier**.

### 2. Content Classifier
- AI module that analyzes content types, engagement levels, and categories.
- Outputs metadata to:
  - **MongoDB**
  - **Elasticsearch**
  - **Discovery Engine**

### 3. MongoDB & Elasticsearch
- **MongoDB**: Stores structured influencer and campaign data.
- **Elasticsearch**: Enables fast, complex search operations for creator discovery.

### 4. Discovery Engine
- Uses classified and stored data to **recommend suitable creators**.
- Outputs a **List of Recommended Creators**.

### 5. Promotional Campaign
- Created by the **advertiser**.
- Receives creator suggestions from the Discovery Engine.
- Advertiser **selects desired creators** for the campaign.

### 6. List of Recommended Creators
- Sent to the advertiser based on campaign criteria.
- Passed to the **Voice Agent** for outreach.

### 7. Voice Agent (ElevenLabs + Twilio)
- AI voice assistant initiates **calls to selected creators**.
- Handles **negotiation** for campaign participation.

---

## 📞 Final Outcome

- The **Voice Agent** calls creators to **negotiate and finalize participation** in the promotional campaign.

---

## 🔧 Technologies Used

- **MongoDB** – For storing influencer and campaign data.
- **Elasticsearch** – For fast and powerful creator search.
- **AI Classifier** – For content analysis and categorization.
- **ElevenLabs** – AI-generated voice interaction.
- **Twilio** – For handling phone calls and telephony.

---

## 🔄 Summary Flow

1. **Creator registers** → Content is analyzed → Data stored
2. **Advertiser creates campaign** → Engine suggests creators
3. **Advertiser selects creators** → Voice Agent initiates negotiation
4. **Phone call completes** the influencer engagement process
