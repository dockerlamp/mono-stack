import { Service } from 'typedi';

import { ILoggerConfig } from './ILoggerConfig';
import { config } from './config/default';

@Service()
export class LoggerConfigProvider {
    public getConfig(): ILoggerConfig {
        return config;
    }
}