import { Service } from 'typedi';
import { Connection } from 'mongoose';

import { FrontConfigProvider } from '../../front/config/FrontConfigProvider';
import { MongoFactory } from './MongoFactory';

@Service()
export class MongoConnection {
    private connection: Connection;

    constructor(private configProvider: FrontConfigProvider) {
        const mongoConfig = configProvider.getConfig().model.mongodb;
        this.connection = MongoFactory.getConnection(mongoConfig);
    }

    public getConnection(): Connection {
        return this.connection;
    }
}