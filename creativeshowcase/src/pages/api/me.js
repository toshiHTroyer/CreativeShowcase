import nextConnect from 'next-connect';
import { sessionOptions } from '../../lib/session.js';
import passport from '../../lib/passport.js';

const handler = nextConnect();

handler.use(sessionOptions);
handler.use(passport.initialize());
handler.use(passport.session());

handler.get((req, res) => {
    res.status(200).json({ user: req.user || null });
  });

export default handler;