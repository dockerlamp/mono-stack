import * as express from 'express';
import { Request, Response } from 'express';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as strategy from 'passport-github';

let app = express();
app.use(morgan('tiny'));
let gitHubStrategy = strategy.Strategy;

passport.use(new gitHubStrategy({
    clientID: '618ce3b2f392ec237da4',
    clientSecret: '52449d1083251457705a2397442c713176e4a33a',
    callbackURL: 'http://127.0.0.1:3000/auth/github/logged',
},
(accessToken, refreshToken, profile, cb) => {
    console.log(accessToken, refreshToken, profile);
    cb(null, {});
}));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/logged',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.listen(3000, () => {
    console.log('Front app listening on port 3000!');
});
