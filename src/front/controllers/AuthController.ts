import { Express } from 'express';
import * as passport from 'passport';
import * as strategy from 'passport-github';

import { config } from '../config';
import { IController } from './IController';
import { commandBus } from '../../model/command-bus';
import { LoginUserCommand } from '../../model/user/command/LoginUser';

const PROVIDER_NAME = 'github';

export class AuthController implements IController {
    private githubPassport;

    constructor() {
        this.githubPassport = new passport.Passport();
    }

    public async initMiddlewares(app: Express): Promise<void> {
        app.use(this.githubPassport.initialize());
        // @TODO do weryfikacji czym jest sesja passport, czy ma jakies powiazanie z sessja expressa
        // czy takie rozwiazanie jest skalowalne (dotyczy loadbalncerow)
        app.use(this.githubPassport.session());
    }

    public async initRoutings(app: Express): Promise<void> {
        let gitHubStrategy = strategy.Strategy;

        this.githubPassport.use(new gitHubStrategy(config.oAuthApps.gitHub,
            (accessToken, refreshToken, profile, cb) => {
                cb(null, profile);
            },
        ));

        this.githubPassport.serializeUser((user, done) => {
            done(null, user);
        });

        this.githubPassport.deserializeUser((user, done) => {
            done(null, user);
        });
        const passportAuthenticate = this.githubPassport.authenticate(PROVIDER_NAME);

        app.get(`/login/${PROVIDER_NAME}`, passportAuthenticate );

        app.get(`/login/${PROVIDER_NAME}/callback`, passportAuthenticate, async (req, res, next) => {
            this.loginHandler(req, res).catch(next);
        });

        app.get('/logout', async (req, res, next) => {
            this.logoutHandler(req, res).catch(next);
        });
    }

    private async loginHandler(req, res) {
        let loginUserCommand = new LoginUserCommand();
        loginUserCommand.user = {
            provider: PROVIDER_NAME,
            providerUserId: req.session.passport.user.id,
            name: req.session.passport.user.username,
            sessionId: req.session.id
        };
        await commandBus.sendCommand(loginUserCommand);
        req.session.loginInProgress = true;
        res.redirect('/');
    }

    private async logoutHandler(req, res) {
        req.session = null;
        res.redirect('/');
    }
}