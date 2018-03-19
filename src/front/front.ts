import * as express from 'express';
import * as session from 'express-session';
import { Request, Response } from 'express';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as strategy from 'passport-github';
import rc = require('rc');

import { UserRepo } from './user_repo';

// @TODO definicja domyslnych wartosci, mozliwych kluczy
interface IConfig {
    oAuthApps: {
        gitHub: {
            clientID: string,
            clientSecret: string
            callbackURL: string
        }
    };
}
let defaultConfig = {};
let config: IConfig = rc('monostack', defaultConfig);

let app = express();
app.use(morgan('tiny'));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret: 'mono-stack',
}));

let gitHubStrategy = strategy.Strategy;
let userRepo = new UserRepo();

passport.use(new gitHubStrategy(config.oAuthApps.gitHub,
    (accessToken, refreshToken, profile, cb) => {
        cb(null, profile);
    },
));

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
        userRepo.addUser('github', req.session.passport.user);
        let user = userRepo.getUser('github', req.session.passport.user.id);
        req.session.user = user;
        res.redirect('/');
    });

app.get('/', (req, res) => {
    if (req.session.user) {
        res.send('Hi, you are logged as ' + req.session.passport.user.username);
        console.log('logged user', req.session.user, 'session id is', req.sessionID);
    } else {
        // res.redirect('/login/github');
        res.send('Hi, you are anonymous, please sign in!');
        console.log('anonymous user connected');
    }
    console.log(userRepo.repoStats());
});

app.listen(3000, () => {
    console.log('Front app listening on port 3000!');
});
