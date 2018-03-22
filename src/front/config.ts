import rc = require('rc');

// @TODO definicja domyslnych wartosci, mozliwych kluczy
export interface IConfig {
    port: number;
    session: {
        redis: {
            port: number;
            host: string;
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
    session: {
        redis: {
            port: 6379,
            host: 'redis-session',
        }
    }
};

export let config: IConfig = rc('monostack', defaultConfig);