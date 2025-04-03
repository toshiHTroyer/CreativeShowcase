import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/db.js';
import bcrypt from 'bcrypt';

//Implemented Passport.js with the LocalStrategy, integrating secure session management via express-session and MongoDB storage 
//This setup uses passport.authenticate() inside Next.js API routes to validate credentials and issue sessions
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

// To maintain login session, Passport serializes and deserializes user information to and from the session
// This runs right after a user logs in & tells Passport what info to save in the session (we only save the user ID).
passport.serializeUser((user, done) => done(null, user.id));
//runs when the session is authenticated in & uses ID saved in the session to get the full user from db
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    //adds full user to req.user
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;