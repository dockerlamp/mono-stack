import { Service } from 'typedi';
import * as winston from 'winston';

import { FrontConfigProvider } from '../../front/config/FrontConfigProvider';

@Service()
export class LoggerProxy {
    private loggerInstance: winston.Logger;

    constructor(private frontConfigProvider: FrontConfigProvider) {}

    public getLogger(): winston.Logger {
        if (this.loggerInstance) {
            return this.loggerInstance;
        }

        let transport;
        let config = this.frontConfigProvider.getConfig().logger;

        switch (config.useOption) {
            case 'console':
                transport = new winston.transports.Console(config.transports[config.useOption]);
                break;
            case 'file':
                transport = new winston.transports.File(config.transports[config.useOption]);
                break;
            default:
                throw new Error(`Unknown transport medium for logging ${config.useOption}`);
        }
        let logger = new winston.Logger({
            transports : [transport],
        });

        this.loggerInstance = logger;
        return this.loggerInstance;
    }
}
