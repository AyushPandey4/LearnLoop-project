"use strict";

const { OAuth2Client } = require("google-auth-library");

/**
 * Google OAuth2 service.
 * Encapsulates all Google OAuth communication.
 */

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * Generate the Google OAuth consent page URL.
 * The frontend redirects the user to this URL to begin login.
 */
function getGoogleAuthUrl() {
  return client.generateAuthUrl({
    access_type: "offline",
    // openid: required for id_token
    // email, profile: the user data we need
    scope: ["openid", "email", "profile"],
    // prompt: "consent" ensures we always show the consent screen.
    // Without this, returning users skip consent and we may not get a refresh_token.
    prompt: "consent",
  });
}

/**
 * Exchange a one-time authorization code for a verified user identity.
 * Returns the verified payload from Google's id_token.
 *
 * @param {string} code - The authorization code from Google's redirect
 * @returns {{ googleId, email, name, avatar }} - Verified user identity
 * @throws if the code is invalid or verification fails
 */
async function exchangeCodeForUser(code) {
  // Step 1: Exchange the code for tokens.
  // This is a server-to-server call — the browser is not involved.
  const { tokens } = await client.getToken(code);

  // Step 2: Verify the id_token.
  // verifyIdToken checks:
  // - The token's signature (using Google's public keys)
  // - The token's audience matches our CLIENT_ID
  // - The token hasn't expired
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  // payload.sub is the stable Google user ID — it never changes even if the user
  // changes their email or name. This is the correct identity anchor.
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    avatar: payload.picture || "",
  };
}

module.exports = { getGoogleAuthUrl, exchangeCodeForUser };
