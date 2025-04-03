import session from 'express-session';
import MongoStore from 'connect-mongo';

console.log("🔐 DSN:", process.env.DSN);
console.log("🔐 SESSION_SECRET:", process.env.SESSION_SECRET);

export const sessionOptions = session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.DSN }),
});