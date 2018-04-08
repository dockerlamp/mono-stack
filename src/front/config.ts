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
    // @TODO rename to authProvider
    oAuthApps: {
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
    }
};

export let config: IConfig = rc('monostack', defaultConfig);