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

        let loggerConfig = this.frontConfigProvider.getConfig().logger;
        let enabledTransports = [];

        for (let name in loggerConfig.transports) {
            if (!loggerConfig.transports[name].enabled) { continue; }
            let transport;
            switch (name) {
                case 'console':
                    transport = new winston.transports.Console(loggerConfig.transports[name].config);
                    break;
                case 'file':
                    transport = new winston.transports.File(loggerConfig.transports[name].config);
                    break;
                default:
                    throw new Error(`Unknown transport medium for logging: ${name}`);
            }
            enabledTransports.push(transport);
        }

        this.loggerInstance = new winston.Logger({
            transports : enabledTransports,
        });

        return this.loggerInstance;
    }
}
