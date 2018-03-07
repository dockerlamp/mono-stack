import * as express from 'express';
import { Request, Response } from 'express';
import * as morgan from 'morgan';
import * as passport from 'passport';

let app = express();
app.use(morgan('tiny'));


var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: "618ce3b2f392ec237da4",
    clientSecret: "52449d1083251457705a2397442c713176e4a33a",
    callbackURL: "http://127.0.0.1:3000/auth/github/logged"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    console.log(accessToken, refreshToken, profile);
    cb(null, {});
  }
));


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});


app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/logged',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });




app.listen(3000, () => {
    console.log('Front app listening on port 3000!');
});
