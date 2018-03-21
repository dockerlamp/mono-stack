import { Express } from 'express';

import { IController } from './IController';

export class RootController implements IController {
    public async initRoutings(app: Express): Promise<void> {
        app.get('/', (req, res) => {
            // Query:
            //    v1 let user = await query.waitGithubUser(req.session.passport.user.id);
            //    v2  let user = await query.waitForGitHubUser(commandId);
            //    v3  let user = await query.waitForGitHubUser(session.id);
            //    if (user) { req.session.user = user; }

            if (req.session.user) {
                // @TODO tutaj passport nie powinien istniec
                res.send('Hi, you are logged as ' + req.session.passport.user.username);
                // console.log('logged user', req.session.user, 'session id is', req.sessionID);
            } else {
                // res.redirect('/login/github');
                res.send('Hi, you are anonymous, please <a href="/login/github">sign in</a> with github account');
                // console.log('anonymous user connected');
            }
            // console.log(userRepo.repoStats());
        });
    }

    public async initMiddlewares(app: Express): Promise<void> {
        // no middlewares
    }
}