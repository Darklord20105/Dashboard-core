// src/lib/mongoose.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('mongoose.js: Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // 🌟 Extra guard: If Mongoose claims it's cached but readyState says disconnected, clear it.
  if (cached.conn && mongoose.connection.readyState === 0) {
    cached.conn = null;
    cached.promise = null;
  }

  if (cached.conn) {
    console.log('mongoose.js: ⚡ Using cached MongoDB connection'); // 👈 Shows it's reusing the active connection
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 🌟 Stop waiting indefinitely when network drops
    };

    console.log('mongoose.js: ⏳ Connecting to MongoDB...'); // 👈 Shows when it initiates a fresh connection

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((m) => {
        console.log('mongoose.js: ✅ MongoDB connected successfully!'); // 👈 Success visual anchor
        return m;
      })
      .catch((err) => {
        console.log('mongoose.js: ❌ MongoDB connection failed:', err.message); // 👈 Failure visual anchor
        cached.promise = null;
        cached.conn = null;
        throw new Error('mongoose.js: Database Connection Error: ' + err.message);
      });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw new Error('mongoose.js: ' + e)
  }
  return cached.conn;
}
