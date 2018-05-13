import { Service } from 'typedi';
import * as winston from 'winston';

import { LoggerConfigProvider } from './LoggerConfigProvider';
import { ILoggerConfig } from './ILoggerConfig';

@Service()
export class Logger {
    private logger;

    constructor(
        private loggerConfigProvider: LoggerConfigProvider
    ) {
        this.logger = this.createLogger(loggerConfigProvider.getConfig());
    }

    public getLogger(): winston.Logger {
        return this.logger;
    }

    private createLogger(config: ILoggerConfig): winston.Logger {
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
        let wlogger = new winston.Logger({
            transports : [transport],
        });
        // create a stream object with a 'write' function that will be used by `morgan`
        wlogger.stream = {
            write: (message, encoding) => {
                // use the 'info' log level so the output will be picked up by both transports (file and console)
                wlogger.info(message);
            },
        };
        return wlogger;
    }
}
