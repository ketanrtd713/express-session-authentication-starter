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
app.use(passport.session()); // to dos with express session middleware , request session persisted in database in sessions collection



/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);