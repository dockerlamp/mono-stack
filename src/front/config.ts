import rc = require('rc');

// @TODO definicja domyslnych wartosci, mozliwych kluczy
export interface IConfig {
    port: number;
    oAuthApps: {
        gitHub: {
            clientID: string,
            clientSecret: string
            callbackURL: string
        }
    };
}

let defaultConfig = {
    port: 3000
};

export let config: IConfig = rc('monostack', defaultConfig);