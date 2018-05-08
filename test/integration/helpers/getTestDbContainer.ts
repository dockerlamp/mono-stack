import { Container, ContainerInstance } from 'typedi';
import * as _ from 'lodash';
import * as uuid from 'uuid';

import { FrontConfigProvider } from '../../../src/front/config/FrontConfigProvider';

export const TEST_DB = 'monostack-test';

export const getTestDbContainer = (): any => {
    let mockContainerId = {id: uuid.v4()};
    let config = Container.get(FrontConfigProvider).getConfig();

    let testConfig = _.cloneDeep(config);
    testConfig.model.mongodb.database = TEST_DB;
    // @TODO Container.of does not work as expected - now always creating new instance but shouldnt
    // let containerInstance = Container.of(mockContainerId);
    // containerInstance.set(FrontConfigProvider, {
    //     getConfig: () => testConfig
    // });
    Container.set(FrontConfigProvider, {
        getConfig: () => testConfig
    });
    return Container;
};