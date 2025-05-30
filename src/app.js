const express = require("express");
const app = express();
const session = require('express-session');
const routes = require("./routes");
const passport = require("passport");
require('dotenv').config();
const connectDB = require('./config/db');
require('./config/passport')

connectDB();

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', routes);

module.exports = app;