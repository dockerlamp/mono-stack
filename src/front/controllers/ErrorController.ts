import { Service } from 'typedi';
import { Express } from 'express';

import { IController } from './IController';

@Service()
export class ErrorController implements IController {
    public async initRoutings(app: Express): Promise<void> {
        app.use((err, req, res, next) => {
            console.error(err);
            if (res.headersSent) {
                return next(err);
            }
            let errorResponse = {
                error: 'Unhandlerd error',
                message: err.message,
            };
            res.status(500).send(errorResponse);
        });
    }

    public async initMiddlewares(app: Express): Promise<void> {
        // no middlewares
    }
}