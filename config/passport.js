const passport = require('passport');
const validPassword = require('../lib/passwordUtils');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User; // WOW ??

// TODO: passport.use();
// First of all for passport local strategy there is standard that the passport has set so follow it.
// Verify call back

// We will be using LocalStratagy and it requires verify callback and it also requires {username, password, done function}
// this values will be populated by the passport.js
// if you do not name your fields as username and password then passport will not be able to know ...
// what we are doing in verify callback => Our own implementation of passport.js
// It doesn't matter what database you use 
// and how you choose verify credentiales but pass values what passport wants

// const verifyCallBack = function(username, password, done) { // done is the function
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }

const verifyCallBack = (username, password, done) =>{

    User.findOne({username: username})
        .then((user)=>{

            if(!user){ return done(null, false)}

            const isValid = validPassword(password, user.hash, user.salt)

            if(isValid){
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err)=>{
            done(err);
        })

}

const strategy = new LocalStrategy(verifyCallBack)

passport.use(strategy);


// Now add some code that will be used for user to get into session and get out of the session 

passport.serializeUser((userId, done)=>{
    done(null, userId)
})

passport.deserializeUser((userId, done)=>{
    User.findById(userId)
        .then((user)=>{
            done(null, user)
        })
        .catch((err)=>{
            done(err)
        })
})