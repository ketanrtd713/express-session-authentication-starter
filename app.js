const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const connection = require('./config/database');

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo')(session);



/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */

// TODO
const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: "sessions"
})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true, 
    store: sessionStore, // store this item at session store or retrieve from here
    cookie: { // we are storing session id as cookie in browser with expires property with  1 day
        maxAge: 1000* 60* 60* 24
    }
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

app.use(passport.initialize()); // There is the chance that session expires so restart it each time 
// It will rerun everything that just did
app.use(passport.session()); // to dos with express session middleware , request session persisted in database in sessions collection
// They both work together and what they are going to do 
// https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do/28994045#28994045



app.use((req, res, next)=>{
    console.log(req.session) // express sessions make this
    console.log(req.user) // passport do this
    next()
})
// At first when we refresh we didn't get the user
// but when login we get the user after the authentication
// SO passport behind created this property
// The serialise user function grab the user from the database and take id of user and insert that into req.session.passport.user
// When we want to grab the user from the session we are going to use deserialise function, to populate req.user we are going to grab the user from the database and then we are going to attach the found user to req.user passport

// This methods were buit on the request object reques.js
// Login property of it = called by default by passport.authenticate
// req.logout() // It will delete the req.session.passport.user property in browser from the session
// and next time it will check and declare that the user has logged out
// Then redirect 
// Then passport session will find that the user has logged out (ass this middleware checks on each route )


// req.isAuthenticated 
// does the req.passport.user property exists then only true
// 


// req.isUnAuthenticated = reverse of above

// This are not very well documented in passport, we can use this properties for our advantage 
/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000, ()=>{
    console.log("server started on port 3000");
});