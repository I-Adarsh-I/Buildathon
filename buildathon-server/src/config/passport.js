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
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async(accessToken, refreshToken, profile, done) => {
      // console.log("Google Profile:", profile);
      // return done(null, profile);
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          // If user exists, pass the Mongoose document to done
          return done(null, existingUser); // <--- Make sure you return 'existingUser' here
        } else {
          // If new user, create it and then pass the *created Mongoose document* to done
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePhoto: profile.photos[0].value,
            // Add other fields you need for a new user
          });
          return done(null, newUser); // <--- Make sure you return 'newUser' here
        }
      } catch (error) {
        // If an error occurs, pass the error to done
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
