import { Express } from 'express';
import * as passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github';

import { config } from '../config';
import { IController } from './IController';
import { commandBus } from '../../model/command-bus/factory';
import { LoginUserCommand } from '../../model/user/command/LoginUser';

const GITHUB_PROVIDER = 'github';

export class AuthController implements IController {
    private githubPassport;

    constructor() {
        this.githubPassport = this.getPassport(GITHUB_PROVIDER);
    }

    public async initMiddlewares(app: Express): Promise<void> {
        app.use(this.githubPassport.initialize());
        // @TODO do weryfikacji czym jest sesja passport, czy ma jakies powiazanie z sessja expressa
        // czy takie rozwiazanie jest skalowalne (dotyczy loadbalncerow)
        app.use(this.githubPassport.session());
    }

    public async initRoutings(app: Express): Promise<void> {
        const passportAuthenticate = this.githubPassport.authenticate(GITHUB_PROVIDER);

        app.get(`/login/${GITHUB_PROVIDER}`, passportAuthenticate );

        app.get(`/login/${GITHUB_PROVIDER}/callback`, passportAuthenticate, async (req, res, next) => {
            this.loginHandler(req, res).catch(next);
        });

        app.get('/logout', async (req, res, next) => {
            this.logoutHandler(req, res).catch(next);
        });
    }

    private async loginHandler(req, res) {
        let loginUserCommand = new LoginUserCommand();
        loginUserCommand.payload = {
            provider: GITHUB_PROVIDER,
            providerUserId: req.session.passport.user.id,
            name: req.session.passport.user.username,
        };
        await commandBus.sendCommand(loginUserCommand);
        req.session.loginInProgress =  {
            provider: GITHUB_PROVIDER,
            providerUserId: req.session.passport.user.id,
        };
        res.redirect('/');
    }

    private async logoutHandler(req, res) {
        req.session = null;
        res.redirect('/');
    }

    private getPassport(providerName: string): any {
        // @TODO support more providers
        if (providerName !== GITHUB_PROVIDER) {
            throw new Error(`Unknown provider ${providerName}`);
        }
        let passportInstance = new passport.Passport();
        let strategyVerifyCallback = (accessToken, refreshToken, profile, cb) => {
            cb(null, profile);
        };
        let strategy = new GithubStrategy(config.oAuthApps.gitHub, strategyVerifyCallback);

        passportInstance.use(strategy);

        passportInstance.serializeUser((user, done) => {
            done(null, user);
        });

        passportInstance.deserializeUser((user, done) => {
            done(null, user);
        });

        return passportInstance;
    }
}