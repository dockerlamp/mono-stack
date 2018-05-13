// reflect-metadata is required for typedi module
import 'reflect-metadata';
import { Container } from 'typedi';

import { ApplicationFactory } from './ApplicationFactory';
import { FrontConfigProvider } from './config/FrontConfigProvider';
import { Logger } from '../common/logger/Logger';

const logger = new Logger().getLogger();

(async () => {
    const applicationFactory = Container.get(ApplicationFactory);
    let app = await applicationFactory.createApplication();

    const configProvider = Container.get(FrontConfigProvider);
    const port = configProvider.getConfig().port;
    app.listen(port, () => {
        logger.info(`Front app listening on port ${port}!`);
    });
})();
