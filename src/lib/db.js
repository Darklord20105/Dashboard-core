// src/lib/db.js
// Not used fir demonstration purpose only
import { MongoClient } from 'mongodb';

// Ensure your MongoDB URI is added to a local .env file later!
const uri = process.env.MONGODB_URI; 

if (!uri) {
  throw new Error('Please add your MONGODB_URI to your .env file');
}

let client;
let clientPromise;

// In development, preserve the connection across fast-refreshes
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, build a clean connection
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
