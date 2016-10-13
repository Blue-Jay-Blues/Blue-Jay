const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const sql = require('../db/sqlConnectionHelper.js');
const jwt = require('./authentication.js');

if (process.env.CI) {
  var keys = require('./credentials/apiKeys.example.js');
} else {
  var keys = require('./credentials/apiKeys.js');
}

var token;
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
  clientID: keys.googleClientId,
  clientSecret: keys.googleClientSecret,
  callbackURL: 'https://localhost:8443/google/success'
}, function(accessToken, refreshToken, profile, done) {
  sql('select * from users where users.googleId = ' + profile.id, function (error, rows) {
    if (error) { 
      console.log(error);
      done();
      return;
    }
    if (rows.length) {
      token = jwt.createToken(rows[0]);
      done();
    } else {

      var newUser = { 
        'username': profile.emails[0].value.slice(0, profile.emails[0].value.indexOf('@')),
        'firstName': profile.name.givenName,
        'lastName': profile.name.familyName,
        'email': profile.emails[0].value,
        'avatarUrl': profile.photos[0].value,
        'mobileNumber': null,
        'avatarThumbUrl': profile.photos[0].value,
        'createdAt': new Date(),
        'updatedAt': new Date(),
        'googleId': profile.id,
      };

      var keys = [];
      var values = [];

      for (let key in newUser) {
        keys.push(key);
        values.push(newUser[key]);
      }

      sql([
        'INSERT INTO users (' + keys.join(', ') + ')',
        'VALUES ("' + values.join('", "') + '")'
      ].join(' '), function (error, rows) {
        if (error) { console.log(error); }
        sql('select * from users where users.googleId = ' + profile.id, function (error, rows) {
          if (error) { console.log(error); }
          token = jwt.createToken(rows[0]);
          done();
        });
      });
    }
  });
}));

var getToken = function () {
  var temp = token;
  token = 'invalid';
  return temp;
};



module.exports = {
  passport: passport,
  getToken: getToken,
};











