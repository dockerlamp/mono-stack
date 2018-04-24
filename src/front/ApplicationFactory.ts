import 'reflect-metadata';
import {Service, Container} from 'typedi';
import { Express } from 'express';
import * as express from 'express';
import * as morgan from 'morgan';

import { config } from './config';
import { IController } from './controllers/IController';
import { RootController } from './controllers/RootController';
import { AuthController } from './controllers/AuthController';
import { ErrorController } from './controllers/ErrorController';
import { SessionFactory } from './middlewares/SessionFactory';

@Service()
export class ApplicationFactory {
    constructor(
        private sessionFactory: SessionFactory
    ) {}

    public async createApplication(app?: Express): Promise<Express> {
        if (!app) {
            app = express();
        }
        app.use(morgan('tiny'));
        app.use(this.sessionFactory.create());
        app.use((req, res, next) => {
            if (!req.session) {
                next(new Error('Can not work without session!'));
                return;
            }
            next();
        });

        await this.setupControllers(app);

        return app;
    }

    private getControllers(): IController[] {
        return [
            new RootController(),
            new AuthController(),
            new ErrorController(),
        ];
    }

    private async setupControllers(app: Express) {
        let controllers = this.getControllers();
        // middlewares
        for (let controller of controllers) {
            await controller.initMiddlewares(app);
        }
        // routings
        for (let controller of controllers) {
            await controller.initRoutings(app);
        }
    }
}