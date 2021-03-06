var express = require('express');
var bodyParser = require('body-parser').json;
var path = require('path');
var dbHandler = require('../db/rawSQLHandlers');
var fs = require('fs');
var jwtAuth = require('./authentication.js');
var passport = require('./googleOAuth.js').passport;
var getToken = require('./googleOAuth.js').getToken;
var sql = require('../db/sqlConnectionHelper.js');

var app = express();
app.use(bodyParser());

app.use(express.static(path.join(__dirname, '../../client')));

app.get('/google/login', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));

app.get('/google/success', (req, res) => {
  // Used to grab header refer and perform a login redirect
  // const nextParamsIndex = req.headers.referer.lastIndexOf('?');
  // const nextParamsRaw = req.headers.referer.slice(nextParamsIndex);
  // const nextParams = nextParamsRaw.replace(/%2F/g, '/');
  // nextParams will need to be concatenated to redirect url
  passport.authenticate('google', (err, user, info) => {
    res.redirect('/jwt/' + getToken());
  })(req, res);
});

app.post('/users/login', (req, res) => { jwtAuth.giveToken(req, res); });
app.post('/api/authenticated', (req, res) => { jwtAuth.checkToken(req, res); });
app.post('/api/users', (req, res) => { dbHandler.addUser(req, res); });
app.get('/api/streams', (req, res) => { dbHandler.searchStreams(req, res); });

app.use(jwtAuth.middleware);

// app.get('/api/users', (req, res) => { dbHandler.getUsers(req, res); });
app.put('/api/users', (req, res) => { dbHandler.updateUser(req, res); });
app.get('/api/users/', (req, res) => { dbHandler.getUser(req, res); });
app.delete('/api/users', (req, res) => { dbHandler.deleteUser(req, res); });

app.get('/api/users/subscriptions', (req, res) => { dbHandler.getSchedule(req, res); });
app.post('/api/users/subscriptions', (req, res) => { dbHandler.addSubscription(req, res); });
app.put('/api/users/subscriptions', (req, res) => { dbHandler.updateSubscription(req, res); });

app.post('/api/streams', (req, res) => { dbHandler.addStream(req, res); });
app.put('/api/streams', (req, res) => { dbHandler.updateStream(req, res); });

app.get('/api/streams/extra', (req, res) => { dbHandler.getStream(req, res); });
app.put('/api/streams/extra', (req, res) => { dbHandler.deleteStream(req, res); });

// Catch-all will redirect to react app then re-routed by react-router
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client', 'index.html'));
});

module.exports = app;
