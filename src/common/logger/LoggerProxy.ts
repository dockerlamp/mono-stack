import { Service } from 'typedi';
import * as _ from 'lodash';
import * as winston from 'winston';

import { FrontConfigProvider } from '../../front/config/FrontConfigProvider';

@Service()
export class LoggerProxy {
    private loggerInstance: winston.Logger;

    constructor(private frontConfigProvider: FrontConfigProvider) {}

    public getLogger(): winston.Logger {
        if (!this.loggerInstance) {
            this.loggerInstance = this.createLoggerInstance();
        }
        return this.loggerInstance;
    }

    private createLoggerInstance() {
        return new winston.Logger({
            transports : this.getTransports(),
        });
    }

    private getTransports(): any {
        let loggerConfig = this.frontConfigProvider.getConfig().logger;
        let enabledTransports = [];

        // @TODO refactor using chain & map from _
        for (let name in loggerConfig.transports) {
            if (!loggerConfig.transports[name].enabled) { continue; }
            let transportInstance = this.getTransportInstance(name, loggerConfig.transports[name].config);
            enabledTransports.push(transportInstance);
        }
        return enabledTransports;
    }

    private getTransportInstance(transportName, transportConfigItem): any {
        let transportTypeMap = {
            console : winston.transports.Console,
            file: winston.transports.File,
        };
        let transportType = transportTypeMap[transportName];
        return new transportType(transportConfigItem);
    }
}
