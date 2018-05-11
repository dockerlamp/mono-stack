import {} from 'jest';
import { Express } from 'express';
import * as express from 'express';
import * as request from 'supertest';
import Container from 'typedi';

import { ApplicationFactory } from '../../../src/front/ApplicationFactory';
import { IUser } from '../../model/user/model/types';

describe('RootControoler', () => {
    let expressApplication: Express;
    let applicationFactory: ApplicationFactory;

    beforeEach(async () => {
        applicationFactory = Container.get(ApplicationFactory);
    });

    it('get / should return status 200', async () => {
        expressApplication = express();
        await applicationFactory.createApplication(expressApplication);
        await request(expressApplication)
            .get('/')
            .timeout(1000)
            .expect(/anonymous/)
            .expect(200);
    });

    it('get / when user is logged in', async () => {
        expressApplication = express();
        let user: IUser = {
            userName: 'foobar',
            displayName: 'foo bar',
            id: 'user id',
            providerIds: {
                github: 'git',
                facebook: 'face',
                google: 'goo',
            }
        };
        expressApplication.use((req, res, next) => {
            req.user = user;
            next();
        });
        await applicationFactory.createApplication(expressApplication);
        await request(expressApplication)
            .get('/')
            .timeout(1000)
            .expect(new RegExp(user.displayName))
            .expect(200);
        // @TODO how to pass user to request?
        // example of cookie:
        //   s%3ADozW0xF8fjgIV1cGFVDHJeSDWqDrLguy.LHAahNpDZ22i1xfnuDnOxL%2FtcrwFWzs7GagqcVQmFhQ
        // session data in redis:
        //   get sess:DozW0xF8fjgIV1cGFVDHJeSDWqDrLguy
        //   "{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},
        //   \"passport\":{\"user\":{...}}}"
    });
});
