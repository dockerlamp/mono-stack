import { CommandBus } from './CommandBus';
import { UserWriteModel } from '../user/write-model/UserWriteModel';
import { LoginUserHandler } from '../user/command-handler/LoginUserHandler';
import { UserReadModel } from '../user/read-model/UserReadModel';
import { MongoFactory } from '../db/MongoFactory';
import { config } from '../../front/config';

// @TODO refactor mess code to Factory or Dependency Injection Container
export const commandBus = new CommandBus();

let getWriteModel = async (): Promise<UserWriteModel> => {
    console.log('1');
    let connection = await MongoFactory.getConnection(config.model.mongodb);
    console.log('2');
    const userWriteModel = new UserWriteModel(connection);
    console.log('3');
    commandBus.registerCommandHandler(new LoginUserHandler(userWriteModel));
    console.log('4');
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
