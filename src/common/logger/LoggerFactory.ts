import { Service } from 'typedi';
import * as winston from 'winston';

import { LoggerConfigProvider } from './LoggerConfigProvider';

@Service()
export class LoggerFactory {
    constructor(private loggerConfigProvider: LoggerConfigProvider) {}

    public create(): winston.Logger {
        let transport;
        let config = this.loggerConfigProvider.getConfig();

        switch (config.useOption) {
            case 'console':
                transport = new winston.transports.Console(config.options[config.useOption]);
                break;
            case 'file':
                transport = new winston.transports.File(config.options[config.useOption]);
                break;
            default:
                throw new Error(`Unknown transport medium for logging ${config.useOption}`);
        }
        let logger = new winston.Logger({
            transports : [transport],
        });
        return logger;
    }
}
