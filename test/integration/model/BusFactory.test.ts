import {} from 'jest';

import * as factory from '../../../src/model/command-bus/factory';
import { UserWriteModel } from '../../../src/model/user/write-model/UserWriteModel';
import { UserReadModel } from '../../../src/model/user/read-model/UserReadModel';

describe('Buses factory', () => {

    it('should return user write model', async () => {
        let writeModel = await factory.writeModel;
        expect(writeModel).toBeInstanceOf(UserWriteModel);
    });

    it('should return user read model', async () => {
        let readModel = await factory.readModel;
        expect(readModel).toBeInstanceOf(UserReadModel);
    });

});
