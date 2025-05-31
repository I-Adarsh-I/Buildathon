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
          console.log("fd")
          return done(null, false, { message: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("password matched: ", isMatch);
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
    (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  // console.log("logging user from passport: ", user);
  done(null, user._id || user.id);
});

passport.deserializeUser(async (obj, done) => {
  try {
    console.log("logging object: ", obj)
    const user = await User.findById(obj);
    console.log("logging user from passport 26: ", user);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
