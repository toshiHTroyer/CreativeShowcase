// /api/me.js
import dbConnect from '../../lib/dbConnect.js';
import { sessionOptions } from '../../lib/session.js';
import passport from '../../lib/passport.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  await dbConnect();

  sessionOptions(req, res, () => {
    passport.initialize()(req, res, () => {
      passport.session()(req, res, () => {
        const user = req.user || null;
        res.status(200).json({ user });
      });
    });
  });
}