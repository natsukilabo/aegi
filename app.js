var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.mongodb;

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist/"));
app.use("/skyway-js", express.static(__dirname + "/node_modules/skyway-js/dist/"));
app.use("/stylesheets/html5-device-mockups", express.static(__dirname + "/node_modules/html5-device-mockups/"));


app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);

app.use(session({
  secret: 'secret-key',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new TwitterStrategy({
    consumerKey: process.env.tw_consumer,
    consumerSecret: process.env.tw_consumerSecret,
    callbackURL: process.env.app_url + 'auth/twitter/callback'
  },
  // 認証後の処理
  function(token, tokenSecret, profile, done) {
    console.log(profile)
    MongoClient.connect(url, (err, client) => {
      assert.equal(null, err)
      console.log('Connected successfully to server');
      const db = client.db('remobooo');
      const date1 = new Date();
      var doc = {
        userid:profile.id,
        token:token,
        tokenSecret:tokenSecret
      }
    db.collection('settings').updateOne({userid:profile.id},{$set:doc},{upsert:true});
      client.close();
    });
    return done(null, profile);
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use('/success', usersRouter);
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/?auth_failed' }),
  function (req, res) {
    res.redirect('/success');
  }
);
app.use('/logout', function(req, res){
  res.clearCookie('user_token');
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log(process.env.NODE_ENV)

module.exports = app;
