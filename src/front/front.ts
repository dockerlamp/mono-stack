// reflect-metadata is required for typedi module
import 'reflect-metadata';
import { Container } from 'typedi';
import * as winston from 'winston';

import { ApplicationFactory } from './ApplicationFactory';
import { FrontConfigProvider } from './config/FrontConfigProvider';
import { LoggerProxy } from '../common/logger/LoggerProxy';

(async () => {
    const applicationFactory = Container.get(ApplicationFactory);
    let app = await applicationFactory.createApplication();

    const configProvider = Container.get(FrontConfigProvider);
    const port = configProvider.getConfig().port;
    const logger = Container.get(LoggerProxy).getLogger();

    app.listen(port, () => {
        logger.info(`Front app listening on port ${port}!`);
    });
})();
