import dbConnect from '../../../lib/dbConnect';
import { sessionOptions } from '../../../lib/session';
import passport from '../../../lib/passport';
import { Category } from '../../../models/db';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  await dbConnect();

  sessionOptions(req, res, () => {
    passport.initialize()(req, res, () => {
      passport.session()(req, res, async () => {
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const { id } = req.query;
        try {
          const category = await Category.findOne({ _id: id, user: user._id });
          if (!category) return res.status(404).json({ error: 'Category not found' });

          await category.deleteOne();
          res.status(200).json({ success: true });
        } catch (e) {
          console.error('Category delete error:', e);
          res.status(500).json({ error: 'Server error' });
        }
      });
    });
  });
}