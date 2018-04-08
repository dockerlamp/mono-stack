import {} from 'jest';
import { Connection } from 'mongoose';

import { config } from '../../../src/front/config';
import { MongoFactory } from '../../../src/model/db/MongoFactory';

const TEST_COLLECTION = 'test';

describe('Mongo factory', () => {
    let connection: Connection;

    beforeEach(async () => {
        connection = await MongoFactory.getConnection(config.model.mongodb);
    });

    it('should return mongoose connection', async () => {
        expect(connection).toBeDefined();
        let randomCollectionName = 'TEST_COLLECTION' + Math.round(Math.random() * 1000);
        let entity = await connection.collection(randomCollectionName).findOne({});
        expect(entity).toBeNull();
        await connection.close();
    });

});
