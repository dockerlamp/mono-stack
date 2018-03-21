import { Express } from 'express';

import { IController } from './IController';
import { userReadModel } from '../../model/command-bus';
import { GetSessionUser } from '../../model/query/GetSessionUser';

export class RootController implements IController {
    public async initRoutings(app: Express): Promise<void> {
        app.get('/', async (req, res) => {
            // Query:
            //    v1 let user = await query.waitGithubUser(req.session.passport.user.id);
            //    v2 let user = await query.waitForGitHubUser(commandId);
            //    v3 let user = await query.waitForGitHubUser(session.id); //ok

            if (req.session.loginInProgress) {
                let getSessionUser = new GetSessionUser(userReadModel);
                let user = await getSessionUser.query(req.session.id);
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
                let displayName = req.session.loginInProgress ? 'login in progress' : 'you are anonymous';
                res.send(`Hi, ${displayName}, <a href="/login/github">sign in</a> with github account`);
            }
        });

        app.get('/logout',  (req, res) => {
            req.session = null;
            res.redirect('/');
        });
    }

    public async initMiddlewares(app: Express): Promise<void> {
        // no middlewares
    }
}