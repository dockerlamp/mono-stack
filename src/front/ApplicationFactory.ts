import { Express } from 'express';
import * as express from 'express';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as strategy from 'passport-github';

import { config } from './config';
import { UserRepo } from './user_repo';

export class ApplicationFactory {
    public createApplication(): Express {
        let app = express();
        app.use(morgan('tiny'));
        // @TODO passport jako globalny obiekt - czy jest mozliwosc zdefiniowania osobnej
        // instancji np passAuth = new Passport(...)
        app.use(passport.initialize());
        // @TODO do weryfikacji czym jest sesja passport, czy ma jakies powiazanie z sessja expressa
        // czy takie rozwiazanie jest skalowalne (dotyczy loadbalncerow)
        app.use(passport.session());
        app.use(session({
            secret: 'mono-stack',
        }));

        this.setupRoutinngs(app);

        return app;
    }

    private setupRoutinngs(app: Express) {
        let providerName = 'github';
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

        app.get(`/login/${providerName}`,
          passport.authenticate(providerName));

        app.get(`/login/${providerName}/callback`,
            passport.authenticate(providerName),
            (req, res) => {
                userRepo.addUser(providerName, req.session.passport.user);
                let user = userRepo.getUser(providerName, req.session.passport.user.id);
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
    }
}