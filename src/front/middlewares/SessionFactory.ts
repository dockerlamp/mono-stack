import { Service } from 'typedi';
import * as connectRedis from 'connect-redis';
import { RedisStoreOptions } from 'connect-redis';
import * as Redis from 'ioredis';
import * as session from 'express-session';
import * as express from 'express';

import { FrontConfigProvider } from '../config/FrontConfigProvider';

/* tslint:disable-next-line:variable-name */
const RedisStore = connectRedis(session);

@Service()
export class SessionFactory {
    constructor(private configProvider: FrontConfigProvider) {}

    public create(): express.RequestHandler {
        let config = this.configProvider.getConfig();
        let redisClient: any = new Redis({
            port: config.session.redis.port,
            host: config.session.redis.host
        });
        let redisStoreOptions: RedisStoreOptions = {
            client: redisClient
        };

        return session({
            secret: 'mono-stack',
            resave: false,
            saveUninitialized: true,
            unset: 'destroy',
            store: new RedisStore(redisStoreOptions),
        });
    }
}