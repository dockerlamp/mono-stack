import { Express } from 'express';
import * as passport from 'passport';
import * as strategy from 'passport-github';

import { config } from '../config';
import { IController } from './IController';
import { commandBus } from '../../model/command-bus';
import { ILoginUserCommand } from '../../model/command/ILoginUserCommand';
import { LoginUserCommand } from '../../model/command/LoginUser';

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
            async (req, res) => {
                let loginUserCommand = new LoginUserCommand();
                loginUserCommand.user = {
                    provider: providerName,
                    providerUserId: req.session.passport.user.id,
                    name: req.session.passport.user.username,
                    sessionId: req.session.id
                };
                await commandBus.sendCommand(loginUserCommand);
                req.session.loginInProgress = true;
                res.redirect('/');
            });
    }
}