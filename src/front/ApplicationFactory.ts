import { Express } from 'express';
import * as express from 'express';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as connectRedis from 'connect-redis';
import { RedisStoreOptions } from 'connect-redis';
import * as Redis from 'ioredis';

import { AuthController } from './controllers/AuthController';
import { IController } from './controllers/IController';
import { RootController } from './controllers/RootController';
import { config } from './config';

/* tslint:disable-next-line:variable-name */
const RedisStore = connectRedis(session);

export class ApplicationFactory {
    public async createApplication(): Promise<Express> {
        let app = express();
        app.use(morgan('tiny'));
        app.use(this.getSessionMiddleware());

        await this.setupControllers(app);

        return app;
    }

    private getSessionMiddleware(): express.RequestHandler {
        let redisClient: any = new Redis({
            port: config.session.redis.port,
            host: config.session.redis.host
        });
        let redisConfig: RedisStoreOptions = {
            client: redisClient
        };

        return session({
            secret: 'mono-stack',
            resave: false,
            saveUninitialized: true,
            unset: 'destroy',
            store: new RedisStore({client: redisClient}),
        });
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