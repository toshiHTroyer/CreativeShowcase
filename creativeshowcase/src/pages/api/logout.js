import nextConnect from 'next-connect';
import { sessionOptions } from '../../lib/session.js';
import passport from '../../lib/passport.js';

const handler = nextConnect();

handler.use(sessionOptions);
handler.use(passport.initialize());
handler.use(passport.session());

handler.post((req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

export default handler;