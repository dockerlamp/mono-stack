import { config } from './config';
import { ApplicationFactory } from './ApplicationFactory';

const applicationFactory = new ApplicationFactory();
let app = applicationFactory.createApplication();

app.listen(config.port, () => {
    console.log(`Front app listening on port ${config.port}!`);
});
