const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Influencer = require('../models/influencer.model'); // Ensure this path is correct
const Content = require('../models/content.model');     // Ensure this path is correct
require('dotenv').config();

// Define the path to your single Instagram CSV file
const INSTAGRAM_CSV_FILE = path.join(__dirname, '../data/instagram_influencers.csv');
const PLATFORM_NAME = 'instagram';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    return seedInstagramData();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit with error code
  });

/**
 * Seeds Instagram data from the specified CSV file.
 */
async function seedInstagramData() {
  console.log(`\nStarting seeding for platform: ${PLATFORM_NAME}`);
  console.log(`Processing file: ${INSTAGRAM_CSV_FILE}`);

  const rows = [];

  try {
    await new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(INSTAGRAM_CSV_FILE);

      // Handle file stream errors (e.g., file not found)
      readStream.on('error', (err) => {
        console.error(`❌ Error reading file stream for ${INSTAGRAM_CSV_FILE}:`, err);
        if (err.code === 'ENOENT') {
          console.error(`❌ File not found: ${INSTAGRAM_CSV_FILE}. Please ensure the file exists.`);
          reject(new Error(`File not found: ${INSTAGRAM_CSV_FILE}`)); // Reject to stop seeding if file is missing
        } else {
          reject(err); // For other errors, reject the promise
        }
      });

      readStream
        .pipe(csv({ separator: ',' })) // Instagram CSVs are comma-separated
        .on('data', row => rows.push(row))
        .on('end', async () => {
          try {
            for (const row of rows) {
              const parsedDate = new Date(row['Post Time']); // Use 'Post Time' for publishedAt
              const publishedAt = isNaN(parsedDate.getTime()) ? null : parsedDate;

              if (publishedAt === null) {
                console.warn(`⚠️ Invalid date format for 'Post Time' in row for user: ${row['Influencer Handle']}. Setting publishedAt to null.`);
              }

              // Parse row into influencer and content data
              const parsed = {
                name: row['Influencer Handle'], // Influencer's main name from 'Influencer Handle'
                contact_email: null, // Assuming contact_email is not in Instagram CSV, set to null
                instagram: { // Data for the 'instagram' subdocument
                  profile_handle: row['Influencer Handle'],
                  followers: parseInt(row.Followers) || 0,
                  views: 0, // 'views' field in schema has no direct mapping in new CSV, defaulting to 0
                },
                content: { // Content data (for Content model)
                  contentType: row['Content Type'], // Mapped to 'Content Type'
                  title: row['Title (Caption)'], // Mapped to 'Title (Caption)'
                  mediaId: row['Post URL'], // Using 'Post URL' as unique mediaId
                  publishedAt: publishedAt, // Use the validated date from 'Post Time'
                  views: 0, // No direct 'views' for content in this CSV, defaulting to 0
                  likes: parseInt(row['Total Likes']) || 0, // Mapped to 'Total Likes'
                  comments: parseInt(row['comments_counts']) || 0, // No single 'comments' count, only individual top comments, defaulting to 0
                  url: row['Post URL'], // Mapped to 'Post URL'
                  thumbnails: {
                    default: row['Image URL'], // Mapped to 'Image URL'
                    medium: row['Image URL'],
                    high: row['Image URL']
                  }
                }
              };

              // Construct influencer-specific data for the new schema
              const influencerData = {
                name: parsed.name,
                contact_email: parsed.contact_email,
                instagram: parsed.instagram, // Add the instagram subdocument
              };

              console.log('Influencer Data prepared for Mongoose:', JSON.stringify(influencerData, null, 2));

              // Find or create Influencer based on the main name
              let influencer = await Influencer.findOne({ name: parsed.name });

              if (!influencer) {
                // Create a new influencer document
                influencer = await Influencer.create(influencerData);
                console.log(`  Created new influencer: ${influencer.name}`);
              } else {
                // Update existing influencer's Instagram data
                await Influencer.updateOne(
                  { _id: influencer._id },
                  { $set: influencerData } // Update with the new Instagram data
                );
                // console.log(`  Updated influencer: ${influencer.name} (${PLATFORM_NAME}) data`);
              }

              // Find or create Content
              const existingContent = await Content.findOne({
                influencer: influencer._id,
                mediaId: parsed.content.mediaId,
                platform: PLATFORM_NAME
              });

              if (!existingContent) {
                await Content.create({
                  influencer: influencer._id,
                  platform: PLATFORM_NAME,
                  ...parsed.content
                });
                // console.log(`  Added content: ${parsed.content.title} for ${influencer.name}`);
              } else {
                // Optionally update existing content if needed
                await Content.updateOne(
                  { _id: existingContent._id },
                  { $set: { ...parsed.content } }
                );
                // console.log(`  Updated existing content: ${parsed.content.title}`);
              }
            }
            console.log(`✅ Successfully processed file: ${INSTAGRAM_CSV_FILE}`);
            resolve();
          } catch (err) {
            console.error(`❌ Error processing rows in ${INSTAGRAM_CSV_FILE}:`, err);
            reject(err);
          }
        })
        .on('error', (err) => { // This handles errors specifically from the csv-parser pipe
          console.error(`❌ Error during CSV parsing for ${INSTAGRAM_CSV_FILE}:`, err);
          reject(err);
        });
    });
  } catch (err) {
    console.error(`❌ Failed to seed data from ${INSTAGRAM_CSV_FILE}:`, err);
  }
  console.log(`✅ Finished seeding for platform: ${PLATFORM_NAME}`);
  process.exit(0); // Exit after seeding is complete
}
