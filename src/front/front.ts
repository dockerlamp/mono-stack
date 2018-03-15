import * as express from 'express';
import * as session from 'express-session';
import { Request, Response } from 'express';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as strategy from 'passport-github';

let app = express();
app.use(morgan('tiny'));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret: 'dockerlamp',
}));

let gitHubStrategy = strategy.Strategy;

passport.use(new gitHubStrategy({
    clientID: '618ce3b2f392ec237da4',
    clientSecret: '52449d1083251457705a2397442c713176e4a33a',
    callbackURL: 'http://127.0.0.1:3000/login/github/callback',
},

(accessToken, refreshToken, profile, cb) => {
    cb(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/login/github',
  passport.authenticate('github'));

app.get('/login/github/callback',
    passport.authenticate('github'),
    (req, res) => {
        // Successful authentication
        res.send('Hello World! mr. ' + req.user.username);
    });

app.get('/', (req, res) => {
});

app.listen(3000, () => {
    console.log('Front app listening on port 3000!');
});
