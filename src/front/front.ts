import { config } from './config';
import { ApplicationFactory } from './ApplicationFactory';

(async () => {
    const applicationFactory = new ApplicationFactory();
    let app = await applicationFactory.createApplication();

    app.listen(config.port, () => {
        console.log(`Front app listening on port ${config.port}!`);
    });
})();
