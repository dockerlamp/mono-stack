import Container from 'typedi';
import {} from 'jest';

import { UserWriteModel } from '../../../src/model/user/write-model/UserWriteModel';
import { UserReadModel } from '../../../src/model/user/read-model/UserReadModel';

describe('Buses factory', () => {

    it('should return user write model', async () => {
        let writeModel = Container.get(UserWriteModel);
        expect(writeModel).toBeInstanceOf(UserWriteModel);
    });

    it('should return user read model', async () => {
        let readModel = Container.get(UserReadModel);
        expect(readModel).toBeInstanceOf(UserReadModel);
    });

});
