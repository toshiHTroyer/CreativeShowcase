import dbConnect from '../../lib/dbConnect.js';
import { User, Portfolio } from '../../models/db.js';
import nextConnect from 'next-connect';
import { sessionOptions } from '../../lib/session.js';
import passport from '../../lib/passport.js';
import bcrypt from 'bcrypt';

const handler = nextConnect();

handler.use(sessionOptions);
handler.use(passport.initialize());
handler.use(passport.session());

function isValidEmail(email) {
  return email.includes('@') && email.includes('.');
}

handler.post(async (req, res) => {
  await dbConnect();
  const { userName, email, password, focus, isPublic } = req.body;

  if (!userName || userName.length < 6) return res.status(400).json({ error: 'Username must be at least 6 characters long.' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email address.' });

  const exists = await User.findOne({ $or: [{ userName }, { email }] });
  if (exists) return res.status(400).json({ error: 'Username or email already in use.' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    const portfolio = new Portfolio({
      user: newUser._id,
      url: userName,
      specialty: focus,
      portfolioSettings: { isPublic }
    });
    await portfolio.save();

    newUser.portfolio = portfolio._id;
    await newUser.save();

    req.logIn(newUser, (err) => {
      if (err) return res.status(500).json({ error: 'Login failed after registration.' });

      res.status(201).json({
        success: true,
        user: {
          userName: newUser.userName,
          portfolioUrl: portfolio.url
        }
      });
    });
  } catch {
    res.status(500).json({ error: 'Registration failed.' });
  }
});

export default handler;