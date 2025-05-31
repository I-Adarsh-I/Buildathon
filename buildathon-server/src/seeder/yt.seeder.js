const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Influencer = require('../models/influencer.model');
const Content = require('../models/content.model');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    return seedAll();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit with error code
  });

/**
 * Seeds data for all specified platforms from multiple CSV files.
 */
async function seedAll() {
  // Generate an array of file paths for YouTube CSVs (youtube_1.csv to youtube_5.csv)
  const youtubeFiles = Array.from({ length: 5 }, (_, i) =>
    path.join(__dirname, `../data/youtube_${i + 1}.csv`)
  );

  // Generate an array of file paths for Instagram CSVs (instagram_1.csv to instagram_5.csv)
  const instagramFiles = Array.from({ length: 5 }, (_, i) =>
    path.join(__dirname, `../data/instagram_${i + 1}.csv`)
  );

  // Seed YouTube data
  await seedPlatform('youtube', youtubeFiles, {
    separator: ',',
    parseRow: (row) => {
      console.log('Raw YouTube CSV Row:', row);

      return {
        name: row.channel_name, // Influencer's main name, often same as channel_name
        contact_email: null, // Assuming contact_email is not in YouTube CSV, set to null
        youtube: { // Data for the 'youtube' subdocument
          channel_link: row.channel_url, // Using video_url as channel_link for now, adjust if you have a dedicated channel_link column
          channel_name: row.channel_name,
          channel_bio: row.bio,
          subscribers: parseInt(row.subscribers) || 0,
          total_views: parseInt(row.total_channel_views) || 0,
          total_videos: parseInt(row.total_channel_videos) || 0 // This field is not in the new influencer schema for yt
        },
        content: {
          contentType: 'video',
          title: row.video_title,
          mediaId: row.video_id,
          publishedAt: new Date(row.published_at),
          views: parseInt(row.video_views) || 0,
          likes: parseInt(row.video_likes) || 0,
          comments: parseInt(row.video_comments) || 0,
          url: row.video_url,
          thumbnails: {
            default: row.thumbnail_medium || "",
            medium: row.thumbnail_medium || "",
            high: row.thumbnail_medium || ""
          }
        }
      };
    }
  });

  // Seed Instagram data
  // await seedPlatform('instagram', instagramFiles, {
  //   separator: ',',
  //   parseRow: (row) => {
  //     const parsedDate = new Date(row['Posted At']);
  //     const publishedAt = isNaN(parsedDate.getTime()) ? null : parsedDate;

  //     if (publishedAt === null) {
  //       console.warn(`⚠️ Invalid date format for 'Posted At' in row for user: ${row.Username}. Setting publishedAt to null.`);
  //     }

  //     return {
  //       name: row.Username, // Influencer's main name
  //       contact_email: null, // Assuming contact_email is not in Instagram CSV, set to null
  //       instagram: { // Data for the 'instagram' subdocument
  //         profile_handle: row.Username,
  //         followers: parseInt(row.Followers) || 0,
  //         views: 0, // 'Views' is not in the new Instagram header, defaulting to 0
  //       },
  //       content: { // Content data (for Content model)
  //         contentType: 'post',
  //         title: row.Caption,
  //         mediaId: row['Image URL'],
  //         publishedAt: publishedAt,
  //         views: 0,
  //         likes: parseInt(row.Likes) || 0,
  //         comments: parseInt(row.Comments) || 0,
  //         url: row['Image URL'],
  //         thumbnails: {
  //           default: row['Image URL'],
  //           medium: row['Image URL'],
  //           high: row['Image URL']
  //         }
  //       }
  //     };
  //   }
  // });

  console.log('✅ All platform data seeded successfully!');
  process.exit(0);
}

/**
 * Seeds data for a single platform from an array of CSV files.
 * @param {string} platform - The name of the platform (e.g., 'youtube', 'instagram').
 * @param {string[]} filePaths - An array of full paths to the CSV files for this platform.
 * @param {object} options - Options for parsing, including separator and parseRow function.
 * @param {string} options.separator - The CSV column separator (e.g., ',', '\t').
 * @param {function(object): object} options.parseRow - Function to transform a CSV row object into influencer and content data.
 */
async function seedPlatform(platform, filePaths, { separator, parseRow }) {
  console.log(`\nStarting seeding for platform: ${platform}`);

  for (const filePath of filePaths) {
    console.log(`Processing file: ${filePath}`);
    const rows = [];

    try {
      await new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filePath);

        // Handle file stream errors (e.g., file not found)
        readStream.on('error', (err) => {
          console.error(`❌ Error reading file stream for ${filePath}:`, err);
          if (err.code === 'ENOENT') {
            console.warn(`⚠️ Skipping missing file: ${filePath}`);
            resolve(); // Resolve the promise to continue to the next file
          } else {
            reject(err); // For other errors, reject the promise
          }
        });

        readStream
          .pipe(csv({ separator }))
          .on('data', row => rows.push(row))
          .on('end', async () => {
            try {
              for (const row of rows) {
                const parsed = parseRow(row);

                const influencerData = {
                  name: parsed.name,
                  contact_email: parsed.contact_email,
                };

                // Dynamically add the platform-specific subdocument
                if (platform === 'youtube') {
                  influencerData.youtube = parsed.youtube;
                } else if (platform === 'instagram') {
                  influencerData.instagram = parsed.instagram;
                }

                console.log('Influencer Data prepared for Mongoose:', JSON.stringify(influencerData, null, 2));
                let influencer = await Influencer.findOne({ name: parsed.name });

                if (!influencer) {
                  // Create a new influencer document
                  influencer = await Influencer.create(influencerData);
                  console.log(`  Created new influencer: ${influencer.name}`);
                } else {
                  await Influencer.updateOne(
                    { _id: influencer._id },
                    { $set: influencerData }
                  );
                  // console.log(`  Updated influencer: ${influencer.name} (${platform}) data`);
                }

                const existingContent = await Content.findOne({
                  influencer: influencer._id,
                  mediaId: parsed.content.mediaId,
                  platform: platform
                });

                if (!existingContent) {
                  await Content.create({
                    influencer: influencer._id,
                    platform: platform,
                    ...parsed.content
                  });
                  // console.log(`  Added content: ${parsed.content.title} for ${influencer.name}`);
                } else {
                  await Content.updateOne(
                    { _id: existingContent._id },
                    { $set: { ...parsed.content } }
                  );
                }
              }
              console.log(`✅ Successfully processed file: ${filePath}`);
              resolve();
            } catch (err) {
              console.error(`❌ Error processing rows in ${filePath}:`, err);
              reject(err);
            }
          })
          .on('error', (err) => {
            console.error(`❌ Error during CSV parsing for ${filePath}:`, err);
            reject(err);
          });
      });
    } catch (err) {
      console.error(`❌ Failed to seed data from ${filePath}:`, err);
    }
  }
  console.log(`✅ Finished seeding for platform: ${platform}`);
}