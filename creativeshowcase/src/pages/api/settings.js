// pages/api/settings.js
import formidable from 'formidable';
import path from 'path';
import dbConnect from '../../lib/dbConnect';
import { sessionOptions } from '../../lib/session';
import passport from '../../lib/passport';
import { Portfolio } from '../../models/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

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

        const form = formidable({
          multiples: false,
          uploadDir: path.join(process.cwd(), 'public/uploads'),
          keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error('Formidable error:', err);
            return res.status(500).json({ error: 'Error parsing form' });
          }

          const bio = fields.bio?.[0] || '';
          const linkedin = fields.linkedin?.[0] || '';
          const website = fields.website?.[0] || '';
          const instagram = fields.instagram?.[0] || '';
          const bioImageFile = files.bioImage;

          let bioImagePath = null;
          if (bioImageFile && bioImageFile[0]?.newFilename) {
            bioImagePath = `/uploads/${bioImageFile[0].newFilename}`;
          }

          try {
            const portfolio = await Portfolio.findOne({ user: user._id });
            if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

            portfolio.bio = bio;
            portfolio.links = { linkedin, website, instagram };

            if (bioImagePath) {
              portfolio.bioImage = bioImagePath;
            }

            await portfolio.save();
            res.status(200).json({ success: true });
          } catch (e) {
            console.error('Error updating portfolio:', e);
            res.status(500).json({ error: 'Server error' });
          }
        });
      });
    });
  });
}