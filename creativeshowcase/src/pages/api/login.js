import nextConnect from 'next-connect';
import dbConnect from '../../lib/dbConnect.js';
import { sessionOptions } from '../../lib/session.js';
import passport from '../../lib/passport.js';
import { User, Portfolio } from '../../models/db.js';

const handler = nextConnect();

handler.use(sessionOptions);
handler.use(passport.initialize());
handler.use(passport.session());

handler.post(async (req, res, next) => {
  await dbConnect();

  passport.authenticate('local', async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

    req.logIn(user, async (err) => {
      if (err) return res.status(500).json({ error: 'Login failed' });

      const fullUser = await User.findById(user._id).populate('portfolio');
      if (!fullUser?.portfolio) return res.status(404).json({ error: 'Portfolio not found' });

      res.status(200).json({
        success: true,
        user: {
          userName: fullUser.userName,
          email: fullUser.email,
          portfolioUrl: fullUser.portfolio.url
        }
      });
    });
  })(req, res, next);
});

export default handler;