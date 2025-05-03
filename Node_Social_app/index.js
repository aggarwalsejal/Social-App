const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // to parse JSON bodies
app.use(helmet());       // for security headers
app.use(morgan("common")); // for logging

// Connect to MongoDB
const connectToMongo = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in the .env file");
    }
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

connectToMongo();

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// Start server
app.listen(8800, () => {
  console.log("🚀 Backend is running on port 8800!");
});
