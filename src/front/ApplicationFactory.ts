import { Express } from 'express';
import * as express from 'express';
import * as session from 'express-session';
import * as morgan from 'morgan';

import { AuthController } from './controllers/AuthController';
import { IController } from './controllers/IController';
import { RootController } from './controllers/RootController';

export class ApplicationFactory {
    public async createApplication(): Promise<Express> {
        let app = express();
        app.use(morgan('tiny'));
        app.use(session({
            secret: 'mono-stack',
        }));

        await this.setupControllers(app);

        return app;
    }

    private getControllers(): IController[] {
        return [
            new RootController(),
            new AuthController(),
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