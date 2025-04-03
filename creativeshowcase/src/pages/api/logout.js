// /api/logout.js
import { sessionOptions } from '../../lib/session.js';
import passport from '../../lib/passport.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  sessionOptions(req, res, async () => {
    passport.initialize()(req, res, () => {
      passport.session()(req, res, () => {
        req.logout(() => {
          req.session.destroy(() => {
            res.redirect('/');
          });
        });
      });
    });
  });
}