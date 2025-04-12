// src/pages/api/category.js
import dbConnect from '../../lib/dbConnect.js';
import { sessionOptions } from '../../lib/session.js';
import passport from '../../lib/passport.js';
import { User, Portfolio, Category } from '../../models/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  await dbConnect();

  sessionOptions(req, res, async () => {
    passport.initialize()(req, res, () => {
      passport.session()(req, res, async () => {
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const { name } = req.body;
        if (!name || name.trim().length === 0) {
          return res.status(400).json({ error: 'Category name is required' });
        }

        try {
          const portfolio = await Portfolio.findById(user.portfolio);
          if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

          const newCategory = new Category({
            name,
            user: user._id,
            portfolio: portfolio._id,
            projects: [],
          });

          await newCategory.save();

          portfolio.categories.push(newCategory._id);
          await portfolio.save();

          res.status(201).json({ success: true, categoryId: newCategory._id });
        } catch (err) {
          console.error('Category creation error:', err);
          res.status(500).json({ error: 'Server error creating category' });
        }
      });
    });
  });
}