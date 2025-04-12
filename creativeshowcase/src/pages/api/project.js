import dbConnect from '../../lib/dbConnect';
import { sessionOptions } from '../../lib/session';
import passport from '../../lib/passport';
import { Category } from '../../models/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await dbConnect();

  sessionOptions(req, res, () => {
    passport.initialize()(req, res, () => {
      passport.session()(req, res, async () => {
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const { title, categoryId } = req.body;
        if (!title || !categoryId) return res.status(400).json({ error: 'Missing fields' });

        try {
          const category = await Category.findById(categoryId);
          if (!category || String(category.user) !== String(user._id)) {
            return res.status(403).json({ error: 'Invalid category or permission denied' });
          }

          // Construct embedded project
          const newProject = {
            title,
            description: '',
            projectContent: {
              contentType: 'text',
              content: 'placeholder', // required by your schema
              caption: ''
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
}