import rc = require('rc');

import { IFrontConfig } from './IFrontConfig';

const FRONT_APPLICATION_NAME = 'monostack';

let defaultConfig: IFrontConfig = {
    port: 3000,
    model: {
        mongodb: {
            host: 'mongo-model',
            port: 27017,
            database: 'monostack',
        }
    },
    session: {
        redis: {
            host: 'redis-session',
            port: 6379,
        }
    },
    authProvider: {
        gitHub: {
            clientID: 'string',
            clientSecret: 'string',
            callbackURL: 'http://127.0.0.1:3000/login/github/callback',
        },
    },
};

export let config: IFrontConfig = rc(FRONT_APPLICATION_NAME, defaultConfig);