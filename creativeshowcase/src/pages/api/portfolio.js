import dbConnect from '../../lib/dbConnect.js';
import { Portfolio } from '../../models/db.js';

export default async function handler(req, res) {
  await dbConnect();
  const { slug } = req.query;

  const portfolio = await Portfolio.findOne({ url: slug }).populate('user').populate('categories');
  if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

  res.status(200).json({ portfolio });
}