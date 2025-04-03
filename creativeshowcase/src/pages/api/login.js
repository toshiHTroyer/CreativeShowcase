// /api/login.js
import dbConnect from '../../lib/dbConnect.js';
import { sessionOptions } from '../../lib/session.js';
import passport from '../../lib/passport.js';
import { User } from '../../models/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
  await dbConnect();
  return new Promise((resolve, reject) => {
    sessionOptions(req, res, () => {
      passport.initialize()(req, res, () => {
        passport.session()(req, res, () => {
          passport.authenticate('local', async (err, user, info) => {
            if (err) {
              res.status(500).json({ error: 'Internal server error' });
              return reject(err);
            }
            if (!user) {
              return res.status(401).json({ error: info?.message || 'Invalid credentials.' });
            }
            req.login(user, async (err) => {
              if (err) {
                res.status(500).json({ error: 'Login failed.' });
                return reject(err);
              }
              try {
                const fullUser = await User.findById(user._id).populate('portfolio');
                if (!fullUser || !fullUser.portfolio) {
                  return res.status(404).json({ error: 'Portfolio not found.' });
                }

                res.status(200).json({
                  success: true,
                  user: {
                    userName: fullUser.userName,
                    email: fullUser.email,
                    portfolioUrl: fullUser.portfolio.url,
                  },
                });
                return resolve();
              } catch (dbErr) {
                console.error('DB error:', dbErr);
                res.status(500).json({ error: 'Failed to fetch user or portfolio data.' });
                return reject(dbErr);
              }
            });
          })(req, res);
        });
      });
    });
  });
}