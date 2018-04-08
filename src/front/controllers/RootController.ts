import { Express } from 'express';
import * as _ from 'lodash';

import { IController } from './IController';

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

        if (req.user) {
            res.send(
                `Hi, you are logged as ${req.user.userName}/${req.user.displayName}, ` +
                `<a href="/logout">logout</a>`
            );
        } else {
            let loginMessage = _.get(req, 'session.passport.user', false) ?
                `login in progress` :
                'you are anonymous';
            res.send(`Hi, ${loginMessage}, <a href="/login/github">sign in</a> with github account`);
        }
    }
}