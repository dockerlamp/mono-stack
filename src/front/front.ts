import 'reflect-metadata';
import { Container } from 'typedi';

import { ApplicationFactory } from './ApplicationFactory';
import { FrontConfigProvider } from './config/FrontConfigProvider';

(async () => {
    const applicationFactory = Container.get(ApplicationFactory);
    let app = await applicationFactory.createApplication();

    const configProvider = Container.get(FrontConfigProvider);
    const port = configProvider.getConfig().port;
    app.listen(port, () => {
        console.log(`Front app listening on port ${port}!`);
    });
})();
