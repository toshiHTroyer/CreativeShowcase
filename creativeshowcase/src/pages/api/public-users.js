import dbConnect from '../../lib/dbConnect';
import { Portfolio, User } from '../../models/db';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const portfolios = await Portfolio.find({ 'portfolioSettings.isPublic': true })
      .populate('user', 'userName')
      .select('user specialty bioImage url');

    const users = portfolios.map(p => ({
      userName: p.user.userName,
      specialty: p.specialty,
      bioImage: p.bioImage,
      url: p.url,
    }));

    res.status(200).json({ users });
  } catch (err) {
    console.error('Failed to fetch public users:', err);
    res.status(500).json({ error: 'Server error' });
  }
}