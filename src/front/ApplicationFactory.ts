import { Service } from 'typedi';
import { Express } from 'express';
import * as express from 'express';
import * as morgan from 'morgan';
import * as winston from 'winston';

import { IController } from './controllers/IController';
import { RootController } from './controllers/RootController';
import { AuthController } from './controllers/AuthController';
import { ErrorController } from './controllers/ErrorController';
import { SessionFactory } from './middlewares/SessionFactory';
import { Logger } from '../common/logger/Logger';

@Service()
export class ApplicationFactory {
    constructor(
        private sessionFactory: SessionFactory,
        private rootController: RootController,
        private authController: AuthController,
        private errorController: ErrorController,
        @Logger() private logger: winston.Logger,
    ) {}

    public async createApplication(app?: Express): Promise<Express> {
        if (!app) {
            app = express();
        }
        app.use(morgan('tiny', { stream: {
            write: (message, encoding) => { this.logger.info(message); },
        }}));
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
            this.rootController,
            this.authController,
            this.errorController,
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
    };
}