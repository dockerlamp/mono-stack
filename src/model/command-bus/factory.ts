import { CommandBus } from './CommandBus';
import { UserWriteModel } from '../user/write-model/UserWriteModel';
import { LoginUserHandler } from '../user/command-handler/LoginUserHandler';
import { UserReadModel } from '../user/read-model/UserReadModel';
import { MongoFactory } from '../db/MongoFactory';
import { config } from '../../front/config';
import { EventBus } from './EventBus';

// @TODO refactor mess code to Factory or Dependency Injection Container
export const commandBus = new CommandBus();
export const eventBus = new EventBus();

let getWriteModel = async (): Promise<UserWriteModel> => {
    let connection = await MongoFactory.getConnection(config.model.mongodb);
    const userWriteModel = new UserWriteModel(connection, eventBus);
    commandBus.registerCommandHandler(new LoginUserHandler(userWriteModel));
    return userWriteModel;
};

let getReadModelCache = null;
export const getReadModel = async () => {
    if (!getReadModelCache) {

        let userWriteModel = await getWriteModel();
        getReadModelCache = new UserReadModel(userWriteModel);
    }
    return getReadModelCache;
};
