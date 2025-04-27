// src/pages/api/project.js

import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../lib/dbConnect';
import { sessionOptions } from '../../lib/session';
import passport from '../../lib/passport';
import { Category } from '../../models/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await dbConnect();

  sessionOptions(req, res, () => {
    passport.initialize()(req, res, () => {
      passport.session()(req, res, async () => {
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const form = formidable({
          multiples: false,
          uploadDir: path.join(process.cwd(), 'public/projectUploads'),
          keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error('Formidable error:', err);
            return res.status(500).json({ error: 'Error parsing form' });
          }

          const getField = (field) => Array.isArray(field) ? field[0] : field || '';

          const title = getField(fields.title);
          const caption = getField(fields.caption) || '';
          const categoryId = getField(fields.categoryId);
          const file = files.file?.[0];

          if (!title || !categoryId || !file) {
            return res.status(400).json({ error: 'Missing fields' });
          }

          const filePath = `/projectUploads/${file.newFilename}`;
          const mimeType = file.mimetype;

          let contentType = 'other';
          if (mimeType.startsWith('image/')) {
            contentType = 'image';
          } else if (mimeType === 'application/pdf') {
            contentType = 'pdf';
          } else {
            return res.status(400).json({ error: 'Only images and PDFs are allowed.' });
          }

          try {
            const category = await Category.findById(categoryId);
            if (!category || String(category.user) !== String(user._id)) {
              return res.status(403).json({ error: 'Invalid category or permission denied' });
            }

            const newProject = {
              title,
              description: '',
              projectContent: {
                contentType,
                content: filePath,
                caption,
              },
              createdAt: new Date(),
              updatedAt: new Date()
            };

            category.projects.push(newProject);
            await category.save();

            res.status(201).json({ success: true });
          } catch (err) {
            console.error('Server error adding project:', err);
            res.status(500).json({ error: 'Server error adding project' });
          }
        });
      });
    });
  });
}