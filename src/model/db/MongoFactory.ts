import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';

import { IConfig, IMongoConfig } from '../../front/config';

export class MongoFactory {
    public static async getConnection(config: IMongoConfig): Promise<Connection> {
        let connection = mongoose.createConnection(MongoFactory.getConnectionUri(config) , config.options);
        return connection;
    }

    private static getConnectionUri(config: IMongoConfig): string {
        let login = config.user ? `${config.user}:${config.password}@` : '';
        return `mongodb://${login}${config.host}:${config.port}/${config.database}`;
    }
}