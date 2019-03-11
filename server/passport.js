const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const { JWT_SECRET } = require('./configuration');

const User = require('./models/user/user');
const Password = require('./models/user/password');

/*===================================
 *      JSON WEB TOKEN STRATEGY
 *==================================*/

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorisation'),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // If user doesn't exist, handle it
    if (!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    done(null, user);
  } catch (error) {
    done(error, false);
  }
}));

/*===================================
 *          LOCAL STRATEGY
 *==================================*/

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, inputtedPassword, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ email });

    // If not, handle that
    if (!user) {
      return done(null, false);
    }
    
    const passwordData = await Password.findOne({ userId: user._id });
    
    if(!passwordData) {
      return done(null, false);
    }

    // Check if the password is correct
    const isMatch = await passwordData.isValidPassword(passwordData.password, inputtedPassword);

    // If not, handle that
    if (!isMatch) {
      return done(null, false);
    }

    // Otherwise, return the user
    done(null, user);
  } catch (error) {
    done(error, false);
  }
}));