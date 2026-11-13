// src/lib/mongoose.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'mongoose.js: Please define the MONGODB_URI environment variable inside .env'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
    lastFailure: 0,
  };
}

const RETRY_DELAY = 5000;

export async function connectDB() {
  // check if we already have a valid connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log('mongoose.js: ⚡ Using cached MongoDB connection'); // 👈 Shows it's reusing the active connection
    return mongoose.connection;
  }

  // 🌟 Extra guard: If Mongoose claims it's cached but readyState says disconnected, clear it.
  if (cached.conn && mongoose.connection.readyState === 0 ||
    mongoose.connection.readyState === 3) {
    cached.conn = null;
  }

  // return existing promise if one is in progress
  if (cached.promise) {
    return cached.promise;
  }

  // Avoid repeated connection attempts during outages.
  if (
    cached.lastFailure &&
    Date.now() - cached.lastFailure < RETRY_DELAY
  ) {
    throw new Error(
      'MongoDB temporarily unavailable. Retry later.'
    );
  }

  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000, // 🌟 Stop waiting indefinitely when network drops
    connectTimeoutMS: 5000,
    socketTimeoutMS: 10000,
    retryWrites: true,
  };

  // if (!cached.promise) {
  console.log('mongoose.js: ⏳ Connecting to MongoDB...'); // 👈 Shows when it initiates a fresh connection

  cached.promise = mongoose
    .connect(MONGODB_URI, opts)
    .then((m) => {
      console.log('mongoose.js: ✅ MongoDB connected successfully!'); // 👈 Success visual anchor
      cached.conn = m;
      cached.lastFailure = 0;
      return m;
    })
    .catch((err) => {
      console.log('mongoose.js: ❌ MongoDB connection failed:', err.message); // 👈 Failure visual anchor
      cached.lastFailure = Date.now();
      cached.conn = null;
      throw new Error('mongoose.js: Database Connection Error: ' + err.message);
    })
    .finally(() => {
      cached.promise = null;
    });

  return cached.promise;
}
