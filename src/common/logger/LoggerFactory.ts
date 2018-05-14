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
        // @TODO do not create stream for logger, create stream in morgan and redirect logs to logger
        // create a stream object with a 'write' function that will be used by `morgan`
        logger.stream = {
            write: (message, encoding) => {
                // use the 'info' log level so the output will be picked up by both transports (file and console)
                logger.info(message);
            },
        };
        return logger;
    }
}
