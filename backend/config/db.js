"use strict";

const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("[db] MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("[db] Connected to MongoDB Atlas");
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err.message);
    process.exit(1); // Cannot run without a database
  }
}

module.exports = connectDB;
