import rc = require('rc');

// @TODO definicja domyslnych wartosci, mozliwych kluczy
export interface IConfig {
    oAuthApps: {
        gitHub: {
            clientID: string,
            clientSecret: string
            callbackURL: string
        }
    };
}
let defaultConfig = {};
export let config: IConfig = rc('monostack', defaultConfig);