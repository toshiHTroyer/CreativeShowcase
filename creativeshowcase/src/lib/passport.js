import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/db.js';
import bcrypt from 'bcrypt';

passport.use(new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ userName: username });
      if (!user) return done(null, false);
      
      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false);
      
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;