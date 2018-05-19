import { Container } from 'typedi';
import * as _ from 'lodash';

import { FrontConfigProvider } from '../../src/front/config/FrontConfigProvider';
import { getTestLogger } from './helpers/getTestLogger';
import { IFrontConfig } from '../front/config/IFrontConfig';

export const TEST_LOG_FILENAME = 'test.log';

describe('LoggerProxy', () => {
    let testConfig: IFrontConfig;

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

        expect(logger.transports.file).toBeDefined();
        expect(logger.transports.console).toBeUndefined();
    });

    it('should return logger with only console transport set', async () => {
        testConfig.logger.transports.file.enabled = false;
        testConfig.logger.transports.console.enabled = true;
        let logger = getTestLogger(testConfig);

        expect(logger.transports.file).toBeUndefined();
        expect(logger.transports.console).toBeDefined();
    });

    it('should return logger without transport set', async () => {
        testConfig.logger.transports.file.enabled = false;
        testConfig.logger.transports.console.enabled = false;
        let logger = getTestLogger(testConfig);

        expect(logger.transports.file).toBeUndefined();
        expect(logger.transports.console).toBeUndefined();
    });
});