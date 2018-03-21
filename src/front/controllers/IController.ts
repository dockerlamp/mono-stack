import { Express } from 'express';

export interface IController {
    initRoutings(app: Express): Promise<void>;
    initMiddlewares(app: Express): Promise<void>;
}