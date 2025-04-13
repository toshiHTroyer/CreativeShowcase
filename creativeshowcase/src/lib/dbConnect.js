import mongoose from 'mongoose';

const MONGODB_URI = process.env.DSN;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env.local');
}

// Use global cache to persist connection across hot reloads
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // recommended to avoid model overwrite warnings
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}