import {} from 'jest';
import { Express } from 'express';
import * as request from 'supertest';

import { ApplicationFactory } from '../../../src/front/ApplicationFactory';

describe('Express application', () => {
    let expressApplication: Express;

    beforeEach(async () => {
        let applicationFactory = new ApplicationFactory();
        expressApplication = await applicationFactory.createApplication();
    });

    it('get / shoure return status 200', async () => {
        await request(expressApplication)
            .get('/')
            .timeout(1000)
            .expect(/anonymous/)
            .expect(200);
    });
});
