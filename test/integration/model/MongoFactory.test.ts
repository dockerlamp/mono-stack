import {} from 'jest';
import { Connection } from 'mongoose';
import { Container } from 'typedi';

import { MongoFactory } from '../../../src/model/db/MongoFactory';
import { FrontConfigProvider } from '../../../src/front/config/FrontConfigProvider';

const TEST_COLLECTION = 'test';

describe('Mongo factory', () => {
    let connection: Connection;

    beforeEach(async () => {
        const configProvider = Container.get(FrontConfigProvider);
        const mongoConfig = configProvider.getConfig().model.mongodb;
        connection = await MongoFactory.getConnection(mongoConfig);
    });

    it('should return mongoose connection', async () => {
        expect(connection).toBeDefined();
        let randomCollectionName = 'TEST_COLLECTION' + Math.round(Math.random() * 1000);
        let entity = await connection.collection(randomCollectionName).findOne({});
        expect(entity).toBeNull();
        await connection.close();
    });

});
