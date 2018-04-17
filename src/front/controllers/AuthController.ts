import { Express } from 'express';
import * as passport from 'passport';
import * as _ from 'lodash';
import { Strategy as GithubStrategy } from 'passport-github';

import { config } from '../config';
import { IController } from './IController';
import { commandBus, readModel } from '../../model/command-bus/factory';
import { GetProviderUser } from '../../model/user/query/GetProviderUser';
import { LoginUserCommand } from '../../model/user/command/LoginUser';
import { ILoginUser } from '../../model/user/command/ILoginUser';

const GITHUB_PROVIDER = 'github';

interface IGithubProfile {
    id: string;
    displayName: string;
    username: string;
    profileUrl: string;
    photos: [{
        value: string;
    }];
    provider: string;
    emails: [{
        value: string;
        primary: boolean;
        verified: boolean;
    }];
}

export class AuthController implements IController {
    private passport;
    private passportStrategyProviders: string[];

    constructor() {
        this.passportStrategyProviders = [ GITHUB_PROVIDER ];
        this.passport = this.getPassport();
    }

    public async initMiddlewares(app: Express): Promise<void> {
        app.use(this.passport.initialize());
        // @TODO do weryfikacji czym jest sesja passport, czy ma jakies powiazanie z sessja expressa
        // czy takie rozwiazanie jest skalowalne (dotyczy loadbalncerow)
        app.use(this.passport.session());
    }

    public async initRoutings(app: Express): Promise<void> {
        for ( let providerName of this.passportStrategyProviders) {
            const passportAuthenticate = this.passport.authenticate(providerName);

            app.get(`/login/${providerName}`, passportAuthenticate );

            app.get(`/login/${providerName}/callback`, passportAuthenticate, async (req, res, next) => {
                this.loginHandler(req, res).catch(next);
            });
        }

        app.get('/logout', async (req, res, next) => {
            this.logoutHandler(req, res).catch(next);
        });
    }

    private async loginHandler(req, res) {
        res.redirect('/');
    }

    private async logoutHandler(req, res) {
        req.session = null;
        res.redirect('/');
    }

    private getGithubStrategy(): passport.Strategy {
        let strategyVerifyCallback = (accessToken, refreshToken, profile: IGithubProfile, cb) => {
            // f(profile): ILoggedUser -> serialize
            // CQRS command
            this.saveGithubUserProfile(profile)
                .then((user: ILoginUser) => cb( null, user ))
                .catch((err) => cb( err ));
        };
        let strategyOptions = _.merge(config.oAuthApps.gitHub, {
            scope: [ 'user:email' ]
        });
        let strategy = new GithubStrategy(strategyOptions, strategyVerifyCallback);

        return strategy;
    }

    private setupPassportStrategies(passportInstance) {
        for ( let providerName of this.passportStrategyProviders) {
            switch (providerName) {
                case GITHUB_PROVIDER:
                    passportInstance.use(this.getGithubStrategy());
                    break;
                default:
                    throw new Error(`Unknown passport provider ${providerName}`);
            }
        }
    }

    private getPassport(): any {
        let passportInstance = new passport.Passport();
        this.setupPassportStrategies(passportInstance);

        passportInstance.serializeUser((user: ILoginUser, done) => {
            // serializeUser determines, which data of the user object should be stored in the session.passport.user
            // user -> session.passport.user
            done(null, user);
        });

        passportInstance.deserializeUser(async (user: ILoginUser, done) => {
            // deserialize serialized user to store in req.user field
            // session.passport.user -> req.user
            try {
                // CQRS: query
                let getProviderUser = new GetProviderUser(await readModel);
                // @TODO: wait for user ...
                // - repeat/query/sleep
                // - eventbus.subscribe(...)
                let modelUser = await getProviderUser.query(user.provider, user.providerUserId);
                done(null, modelUser);
            } catch (err) {
                done(err);
            }
        });

        return passportInstance;
    }

    private async saveGithubUserProfile(profile: IGithubProfile): Promise<ILoginUser> {
        let user: ILoginUser = {
            provider: GITHUB_PROVIDER,
            providerUserId: profile.id,
            // @TODO send all emails
            email: _.get(profile, 'emails[0].value'),
            userName: profile.username,
            displayName: profile.displayName,
        };
        let loginUserCommand = new LoginUserCommand();
        loginUserCommand.payload = user;
        // send async command and dont wait to complete
        commandBus.sendCommand(loginUserCommand)
            .then(() => console.log('Command sent'))
            .catch((err) => console.error(err));

        return user;
    }
}