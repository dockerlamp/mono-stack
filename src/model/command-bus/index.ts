import { CommandBus } from './CommandBus';
import { UserWriteModel } from '../user/write-model/UserWriteModel';
import { LoginUserHandler } from '../user/command-handler/LoginUserHandler';
import { UserReadModel } from '../user/read-model/UserReadModel';

const userWriteModel = new UserWriteModel();
export const commandBus = new CommandBus();
commandBus.registerCommandHandler(new LoginUserHandler(userWriteModel));
export const userReadModel = new UserReadModel(userWriteModel);
