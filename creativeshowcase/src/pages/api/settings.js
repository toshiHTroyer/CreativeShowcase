import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../lib/dbConnect';
import { sessionOptions } from '../../lib/session';
import passport from '../../lib/passport';
import { Portfolio } from '../../models/db';

//config from link 
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
        //formidable Node.js module for parsing form data for upload file
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

          const getField = (field) => Array.isArray(field) ? field[0] : field || '';

          const bio = getField(fields.bio);
          const linkedin = getField(fields.linkedin);
          const website = getField(fields.website);
          const instagram = getField(fields.instagram);
          const isPublicRaw = getField(fields.isPublic);
          const isPublic = isPublicRaw === 'true' || isPublicRaw === true;

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
            portfolio.portfolioSettings.isPublic = isPublic;

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