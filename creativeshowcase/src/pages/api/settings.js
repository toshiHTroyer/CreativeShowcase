// pages/api/settings.js
import formidable from 'formidable';
import fs from 'fs';
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

        const uploadDir = path.join(process.cwd(), 'public/uploads');
        fs.mkdirSync(uploadDir, { recursive: true });

        const form = formidable({
          multiples: false,
          uploadDir,
          keepExtensions: true,
          filename: (name, ext, part, form) => {
            const timestamp = Date.now();
            const safeExt = ext.startsWith('.') ? ext : `.${ext}`;
            return `user-${user._id}-${timestamp}${safeExt}`;
          },
        });

        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error('Formidable parse error:', err);
            return res.status(500).json({ error: 'File parsing error' });
          }

          // Normalize string fields
          const getField = (field) => Array.isArray(field) ? field[0] : field || '';

          const bio = getField(fields.bio);
          const linkedin = getField(fields.linkedin);
          const website = getField(fields.website);
          const instagram = getField(fields.instagram);
          const bioImageFile = files.bioImage;

          let bioImagePath = null;
          if (bioImageFile && bioImageFile.newFilename) {
            bioImagePath = `/uploads/${bioImageFile.newFilename}`;
          }

          try {
            const portfolio = await Portfolio.findOne({ user: user._id });
            if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

            portfolio.bio = bio;
            portfolio.links = {
              linkedin,
              website,
              instagram,
            };
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