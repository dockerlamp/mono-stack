import { Container } from 'typedi';
import * as _ from 'lodash';

import { FrontConfigProvider } from '../../src/front/config/FrontConfigProvider';
import { LoggerProxy } from '../../src/common/logger/LoggerProxy';

export const TEST_LOG_FILENAME = 'test.log';

describe('LoggerProxy', () => {
    let testConfig;

    beforeEach(async () => {
        let configProvider = Container.get(FrontConfigProvider);
        let config = configProvider.getConfig();
        this.testConfig = _.cloneDeep(config);
    });

    it('should return logger with only file transport set', async () => {
        this.testConfig.logger.transports.file.enabled = true;
        this.testConfig.logger.transports.console.enabled = false;
        this.testConfig.logger.transports.file.config.filename = TEST_LOG_FILENAME;

        Container.set(FrontConfigProvider, {
            getConfig: () => this.testConfig
        });
        let mockConfigProvider = Container.get(FrontConfigProvider);
        let loggerProxy = new LoggerProxy(mockConfigProvider);
        let logger = loggerProxy.getLogger();

        expect('file' in logger.transports).toBeTruthy();
        expect('console' in logger.transports).toBeFalsy();
    });

    it('should return logger with only console transport set', async () => {
        this.testConfig.logger.transports.file.enabled = false;
        this.testConfig.logger.transports.console.enabled = true;

        Container.set(FrontConfigProvider, {
            getConfig: () => this.testConfig
        });
        let mockConfigProvider = Container.get(FrontConfigProvider);
        let loggerProxy = new LoggerProxy(mockConfigProvider);
        let logger = loggerProxy.getLogger();

        expect('file' in logger.transports).toBeFalsy();
        expect('console' in logger.transports).toBeTruthy();
    });

    it('should return logger without transport set', async () => {
        this.testConfig.logger.transports.file.enabled = false;
        this.testConfig.logger.transports.console.enabled = false;

        Container.set(FrontConfigProvider, {
            getConfig: () => this.testConfig
        });
        let mockConfigProvider = Container.get(FrontConfigProvider);
        let loggerProxy = new LoggerProxy(mockConfigProvider);
        let logger = loggerProxy.getLogger();

        expect('file' in logger.transports).toBeFalsy();
        expect('console' in logger.transports).toBeFalsy();
    });
});