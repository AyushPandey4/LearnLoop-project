"use strict";

const { createClient } = require("redis");

let client = null;

async function connectRedis() {
  const url = process.env.REDIS_URL;

  if (!url) {
    console.warn("[redis] REDIS_URL not defined — caching disabled");
    return;
  }

  try {
    client = createClient({ url });

    client.on("error", (err) => {
      // Log but do not crash — Redis is a cache, not the source of truth
      console.warn("[redis] Client error:", err.message);
    });

    await client.connect();
    console.log("[redis] Connected to Redis");
  } catch (err) {
    console.warn("[redis] Connection failed — caching disabled:", err.message);
    client = null; // Ensure getClient() returns null so callers skip cache ops
  }
}

function getClient() {
  return client;
}

module.exports = { connectRedis, getClient };
