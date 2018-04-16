import {} from 'jest';
import { Express } from 'express';
import * as request from 'supertest';

import { ApplicationFactory } from '../../../src/front/ApplicationFactory';

describe('AuthController', () => {
    let expressApplication: Express;

    beforeEach(async () => {
        let applicationFactory = new ApplicationFactory();
        expressApplication = await applicationFactory.createApplication();
    });

    it('get /login/[unknown-provider] should return 404', async () => {
        await request(expressApplication)
            .get('/login/foobar')
            .timeout(1000)
            .expect(404);
    });

    it('get /login/github should redirects to hithub', async () => {
        await request(expressApplication)
            .get('/login/github')
            .timeout(1000)
            .expect(302)
            .expect('location', /https.*github\.com/);
    });

    it('get /logout should redirect to /', async () => {
        await request(expressApplication)
            .get('/logout')
            .timeout(1000)
            .expect(302)
            .expect('location', '/');
    });
});
