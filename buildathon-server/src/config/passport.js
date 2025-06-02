const passport = require("passport");
const User = require("../models/users.models");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Local strategy for normal login
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      // console.log("email and pass: ", email, password);
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log("password matched: ", isMatch);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// strategy for google login 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: '/api/v1/auth/google/callback',
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("user profile", profile)
        const googleId = profile.id;
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const displayName = profile.displayName;
        const profilePhoto = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        let user = null;

        user = await User.findOne({ googleId: googleId });

        if (user) {
          if (user.profilePhoto !== profilePhoto || user.name !== displayName) {
              user.profilePhoto = profilePhoto || user.profilePhoto;
              user.name = displayName || user.name;
              user.googleId = googleId
              await user.save();
          }
          return done(null, user);
        }

        if (email) {
            user = await User.findOne({ email: email });

            console.log("logging user: ", user)

            if (user) {
                if (!user.googleId) {
                    user.googleId = googleId;
                    user.profilePhoto = profilePhoto || user.profilePhoto;
                    await user.save(); // Save the updated user with googleId
                    return done(null, user); // Authenticate with this now-linked user
                } else {
                     console.warn(`User with email ${email} found, but existing googleId ${user.googleId} differs from new Google ID ${googleId}. Proceeding with existing user.`);
                     return done(null, user);
                }
            }
        }

        if (!displayName || !email) {
            return done(new Error("Google profile missing required 'name' or 'email'"), null);
        }

        user = await User.create({
          googleId: googleId,
          name: displayName,
          email: email, // This is guaranteed to be present due to the check above
          profilePhoto: profilePhoto,
        });

        return done(null, user); // Authenticate with the newly created user

      } catch (error) {
        console.error('Google Strategy error:', error);
        // Pass the error to Passport, it will handle failure.
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // console.log("logging user from passport: ", user);
  done(null, user._id);
});

passport.deserializeUser(async (obj, done) => {
  try {
    // console.log("logging object: ", obj)
    const user = await User.findById(obj);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
