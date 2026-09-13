"use strict";

const mongoose = require("mongoose");

/**
 * User Schema
 *
 * Stores identity (from Google OAuth), and category list.
 * Categories are embedded as a string array — they're small, always read
 * together with the user, and don't need independent CRUD beyond the user context.
 *
 * googleId is the stable identifier from Google (the "sub" claim in the id_token).
 * We index it for fast lookup on login/auth. Email can change — googleId cannot.
 */
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true, // Automatically indexed by Mongoose
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Automatically indexed — used for display, not auth lookup
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    categories: {
      type: [String],
      default: ["All"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("User", userSchema);
