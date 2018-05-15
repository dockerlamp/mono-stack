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
    logger: {
        options: {
            file: {
                level: string,
                filename: string,
                handleExceptions: boolean,
                json: boolean,
                maxsize: number,
                maxFiles: number,
                colorize: boolean,
            };
            console: {
                level: string,
                handleExceptions: boolean,
                json: boolean,
                colorize: boolean,
            }
        };
        useOption: string;
    };
}