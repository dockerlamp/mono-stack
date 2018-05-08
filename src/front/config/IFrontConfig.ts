import { IMongoConfig } from '../../common/config/IMongoConfig';

export interface IFrontConfig {
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