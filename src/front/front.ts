import * as express from 'express';
import * as session from 'express-session';
import { Request, Response } from 'express';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as strategy from 'passport-github';

import { config } from './config';
import { UserRepo } from './user_repo';
import { ApplicationFactory } from './ApplicationFactory';

const applicationFactory = new ApplicationFactory();
let app = applicationFactory.createApplication();

app.listen(3000, () => {
    console.log('Front app listening on port 3000!');
});
