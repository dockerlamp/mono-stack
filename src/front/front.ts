import 'reflect-metadata';
import {Container} from 'typedi';
import { config } from './config';
import { ApplicationFactory } from './ApplicationFactory';

(async () => {
    const applicationFactory = Container.get(ApplicationFactory);
    let app = await applicationFactory.createApplication();

    app.listen(config.port, () => {
        console.log(`Front app listening on port ${config.port}!`);
    });
})();
