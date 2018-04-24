import { Service } from 'typedi';

import { IFrontConfig } from './IFrontConfig';
import { config } from './config';

@Service()
export class FrontConfigProvider {
    public getConfig(): IFrontConfig {
        return config;
    }
}