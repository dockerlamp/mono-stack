import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';

import { IMongoConfig } from '../../common/config/IMongoConfig';

export class MongoFactory {
    public static getConnection(config: IMongoConfig): Connection {
        let connectionUri = MongoFactory.getConnectionUri(config);
        let connection = mongoose.createConnection(connectionUri, config.options);
        return connection;
    }

    private static getConnectionUri(config: IMongoConfig): string {
        let login = config.user ? `${config.user}:${config.password}@` : '';
        return `mongodb://${login}${config.host}:${config.port}/${config.database}`;
    }
}