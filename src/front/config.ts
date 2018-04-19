import rc = require('rc');

export interface IMongoConfig {
    host: string;
    port: number;
    user?: string;
    password?: string;
    database: string;
    options?: any;
}
export interface IConfig {
    port: number;
    model: {
        mongodb: IMongoConfig
    };
    session: {
        redis: {
            host: string;
            port: number;
        };
    };
    authProvider: {
        gitHub: {
            clientID: string;
            clientSecret: string;
            callbackURL: string;
        };
    };
}

let defaultConfig = {
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

export let config: IConfig = rc('monostack', defaultConfig);