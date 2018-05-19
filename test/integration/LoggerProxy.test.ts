import { Container } from 'typedi';
import * as _ from 'lodash';

import { FrontConfigProvider } from '../../src/front/config/FrontConfigProvider';
import { getTestLogger } from './helpers/getTestLogger';

export const TEST_LOG_FILENAME = 'test.log';

describe('LoggerProxy', () => {
    let testConfig;

    beforeEach(async () => {
        let configProvider = Container.get(FrontConfigProvider);
        let config = configProvider.getConfig();
        testConfig = _.cloneDeep(config);
    });

    it('should return logger with only file transport set', async () => {
        testConfig.logger.transports.file.enabled = true;
        testConfig.logger.transports.console.enabled = false;
        testConfig.logger.transports.file.config.filename = TEST_LOG_FILENAME;
        let logger = getTestLogger(testConfig);

        expect('file' in logger.transports).toBeTruthy();
        expect('console' in logger.transports).toBeFalsy();
    });

    it('should return logger with only console transport set', async () => {
        testConfig.logger.transports.file.enabled = false;
        testConfig.logger.transports.console.enabled = true;
        let logger = getTestLogger(testConfig);

        expect('file' in logger.transports).toBeFalsy();
        expect('console' in logger.transports).toBeTruthy();
    });

    it('should return logger without transport set', async () => {
        testConfig.logger.transports.file.enabled = false;
        testConfig.logger.transports.console.enabled = false;
        let logger = getTestLogger(testConfig);

        expect('file' in logger.transports).toBeFalsy();
        expect('console' in logger.transports).toBeFalsy();
    });
});