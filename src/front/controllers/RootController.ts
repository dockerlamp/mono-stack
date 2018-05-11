import { Service } from 'typedi';
import { Express } from 'express';
import * as _ from 'lodash';

import { IController } from './IController';

@Service()
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
        if (req.user) {
            res.send(
                `Hi, you are logged as ${req.user.userName}/${req.user.displayName}, ` +
                `<a href="/logout">logout</a>`
            );
        } else {
            let loginMessage = 'you are anonymous';
            res.send(`Hi, ${loginMessage}, <a href="/login/github">sign in</a> with github account`);
        }
    }
}