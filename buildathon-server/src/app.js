require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");

const routes = require("./routes");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

require("./config/passport");

connectDB();

const cors_config = {
  origin: "http://localhost:3001",
  credentials: true,
};

app.use(cors(cors_config));

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "development",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
  })
);

app.get('/', (req,res) => {
  res.status(200).json({message: "Working"})
})

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", routes);
app.use(errorHandler);

module.exports = app;
