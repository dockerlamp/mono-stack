import { Express } from 'express';

import { IController } from './IController';
import { getReadModel } from '../../model/command-bus/factory';
import { GetProviderUser } from '../../model/user/query/GetProviderUser';

export class RootController implements IController {
    public async initRoutings(app: Express): Promise<void> {
        app.get('/', async (req, res, next) => {
            this.rootHandler(req, res).catch(next);
        });
    }

    public async initMiddlewares(app: Express): Promise<void> {
        // no middlewares
    }

    private async rootHandler(req, res) {
        // Query:
        //    v1 let user = await query.waitGithubUser(req.session.passport.user.id);
        //    v2 let user = await query.waitForGitHubUser(commandId);
        //    v3 let user = await query.waitForGitHubUser(session.id); //ok

        if (req.session.loginInProgress) {
            let {provider, providerUserId} = req.session.loginInProgress;
            let userReadModel = await getReadModel();
            let getProviderUser = new GetProviderUser(userReadModel);
            let user = await getProviderUser.query(provider, providerUserId);
            if (user) {
                req.session.user = user;
                req.session.loginInProgress = undefined;
            }
        }

        if (req.session.user) {
            res.send(
                `Hi, you are logged as ${req.session.user.name}, ` +
                `<a href="/logout">logout</a>`
            );
        } else {
            let displayName = req.session.loginInProgress ?
                `${req.session.loginInProgress.provider} login in progress` :
                'you are anonymous';
            res.send(`Hi, ${displayName}, <a href="/login/github">sign in</a> with github account`);
        }
    }
}