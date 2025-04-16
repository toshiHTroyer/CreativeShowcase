// pages/api/settings.js
import dbConnect from '../../lib/dbConnect';
import { sessionOptions } from '../../lib/session';
import passport from '../../lib/passport';
import { Portfolio } from '../../models/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  await dbConnect();

  sessionOptions(req, res, () => {
    passport.initialize()(req, res, () => {
      passport.session()(req, res, async () => {
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
        
        const { bio, links } = req.body;

        try {
          const portfolio = await Portfolio.findOne({ user: user._id });
          if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

          portfolio.bio = bio || '';
          portfolio.links = {
            linkedin: links?.linkedin || '',
            website: links?.website || '',
            instagram: links?.instagram || '',
          };

          await portfolio.save();
          res.status(200).json({ success: true });
        } catch (e) {
          console.error('Error updating portfolio:', e);
          res.status(500).json({ error: 'Server error' });
        }
      });
    });
  });
}