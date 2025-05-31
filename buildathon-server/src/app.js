require("dotenv").config();

const express = require("express");
const app = express();
const session = require("express-session");
const routes = require("./routes");
const passport = require("passport");
const connectDB = require("./config/db");

require("./config/passport");

connectDB();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.PRODUCTION,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", routes);

module.exports = app;
