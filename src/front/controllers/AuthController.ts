import { Express } from 'express';
import * as passport from 'passport';
import * as strategy from 'passport-github';

import { config } from '../config';
import { UserRepo } from '../user_repo';
import { IController } from './IController';

export class AuthController implements IController {
    public async initMiddlewares(app: Express): Promise<void> {
        // @TODO passport jako globalny obiekt - czy jest mozliwosc zdefiniowania osobnej
        // instancji np passAuth = new Passport(...)
        app.use(passport.initialize());
        // @TODO do weryfikacji czym jest sesja passport, czy ma jakies powiazanie z sessja expressa
        // czy takie rozwiazanie jest skalowalne (dotyczy loadbalncerow)
        app.use(passport.session());
    }

    public async initRoutings(app: Express): Promise<void> {
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

        app.get(`/login/${providerName}`, passport.authenticate(providerName) );

        app.get(`/login/${providerName}/callback`,
            passport.authenticate(providerName),
            /* async */(req, res) => {
                // let userPayload = formatUser(req.session.passport.user)
                //    commandId: uuid.v4();
                // await bus.send(UserAuthenticateCommand, userPayload);
                userRepo.addUser(providerName, req.session.passport.user);
                let user = userRepo.getUser(providerName, req.session.passport.user.id);
                req.session.user = user;
                res.redirect('/');
            });
    }
}