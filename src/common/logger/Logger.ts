import { Service } from 'typedi';
import * as winston from 'winston';
import { config } from './config/default';

@Service()
export class Logger {
    public getLogger(): winston.Logger {
        let transport;
        let option = config.useOption;
        switch (option) {
            case 'console':
                transport = new winston.transports.Console(config.options[option]);
                break;
            case 'file':
                transport = new winston.transports.File(config.options[option]);
                break;
            default:
                throw new Error(`Unknown transport medium for logging ${option}`);
        }
        let logger = new winston.Logger({
            transports : [transport],
        });
        return logger;
    }
}
