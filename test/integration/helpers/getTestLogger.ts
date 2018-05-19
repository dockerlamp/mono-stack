import { Container } from 'typedi';

import { FrontConfigProvider } from '../../../src/front/config/FrontConfigProvider';
import { LoggerProxy } from '../../../src/common/logger/LoggerProxy';
import { IFrontConfig } from '../../../src/front/config/IFrontConfig';

export const getTestLogger = (testConfig: IFrontConfig): any => {
    Container.set(FrontConfigProvider, {
        getConfig: () => testConfig
    });
    let mockConfigProvider = Container.get(FrontConfigProvider);
    let loggerProxy = new LoggerProxy(mockConfigProvider);
    return loggerProxy.getLogger();
};