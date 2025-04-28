import dbConnect from '../../lib/dbConnect.js';
import { sessionOptions } from '../../lib/session.js';
import passport from '../../lib/passport.js';
import { User } from '../../models/db.js';

// Next.js API Route implementation: 
// - This file defines a backend endpoint under /api/login using Next.js API routes.
// - Follows Next.js convention where any file inside /pages/api is treated as an API endpoint.
// - The exported async function handler receives Next.js req and res objects.
// - In this case for login, the file handles HTTP POST requests for user login authentication using Passport.js middleware and built-in Next.js serverless functions.
// - Uses sessionOptions middleware to manage sessions directly on the server side, fully within the Next.js serverless environment.

export default async function handler(req, res) {
  // Handle request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
  // ...login/register/logout logic, 
  await dbConnect();
  return new Promise((resolve, reject) => {
    sessionOptions(req, res, () => {
      passport.initialize()(req, res, () => {
        //Uses sessionOptions middleware to manage sessions directly on the server side, fully within the Next.js serverless environment.
        //As user navigates from page to page, session authenticated using built-in session strategy
        passport.session()(req, res, () => {
           //passport.session() sets up serialization and deserialization of users into the session
          passport.authenticate('local', async (err, user, info) => {
          //when the session authenticated, passport will call deserializeUser which sets req.user property
          //note similar implementations in other api files (me, register, logout, register), but we only need to authenticate the user in login
          //ONCE authenticated log the user into the session manually using req.login(user) as seen on line 39 (as we are using custom callback)
            if (err) {
              res.status(500).json({ error: 'Internal server error' });
              return reject(err);
            }
            if (!user) {
              return res.status(401).json({ error: info?.message || 'Invalid credentials.' });
            }
            //Passport exposes a login() function on req to establish a login session.
            //passport.authenticate() middleware invokes req.login() automatically.
            //However, we r using a custom callback & Passport does not automatically call req.login()  
            //so we must manually call req.login(user) here to establish a login session after successful authentication.
            req.login(user, async (err) => {
              if (err) {
                res.status(500).json({ error: 'Login failed.' });
                return reject(err);
              }
              try {
                const fullUser = await User.findById(user._id).populate('portfolio');
                if (!fullUser || !fullUser.portfolio) {
                  return res.status(404).json({ error: 'Portfolio not found.' });
                }

                res.status(200).json({
                  success: true,
                  user: {
                    userName: fullUser.userName,
                    email: fullUser.email,
                    portfolioUrl: fullUser.portfolio.url,
                  },
                });
                return resolve();
              } catch (dbErr) {
                console.error('DB error:', dbErr);
                res.status(500).json({ error: 'Failed to fetch user or portfolio data.' });
                return reject(dbErr);
              }
            });
          })(req, res);
        });
      });
    });
  });
}