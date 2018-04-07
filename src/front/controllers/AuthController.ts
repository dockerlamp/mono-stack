import { Express } from 'express';
import * as passport from 'passport';
import * as _ from 'lodash';
import { Strategy as GithubStrategy } from 'passport-github';

import { config } from '../config';
import { IController } from './IController';
import { commandBus } from '../../model/command-bus/factory';
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
        // req.session.loginInProgress =  {
        //     provider: GITHUB_PROVIDER,
        //     providerUserId: req.session.passport.user.id,
        // };
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
        let strategyVerifyCallback = (accessToken, refreshToken, profile: IGithubProfile, cb) => {
            this.saveGithubUserProfile(profile)
                .then((user) => cb( null, user ))
                .catch((err) => cb( err ));
            // // save received profile as system user
            // console.log('strategyVerifyCallback', profile);
            // // let
            // cb(null, _.omit(profile, '_raw', '_json'));
        };
        let strategyOptions = _.merge(config.oAuthApps.gitHub, {
            scope: [ 'user:email' ]
        });
        let strategy = new GithubStrategy(strategyOptions, strategyVerifyCallback);

        passportInstance.use(strategy);

        passportInstance.serializeUser((user, done) => {
            // serializeUser determines, which data of the user object should be stored in the session
            console.log('serialize', user);
            done(null, user);
        });

        passportInstance.deserializeUser((user, done) => {
            // deserialize serialized user to store in req.user field
            console.log('deserialize', user);
            done(null, user);
        });

        return passportInstance;
    }

    private async saveGithubUserProfile(profile: IGithubProfile): Promise<ILoginUser> {
        let user: ILoginUser = {
            provider: GITHUB_PROVIDER,
            providerUserId: profile.id,
            // @TODO send display name and all emails
            email: _.get(profile, 'emails[0].value'),
            name: profile.username,
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