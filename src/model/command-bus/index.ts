import { CommandBus } from './CommandBus';
import { UserWriteModel } from '../write-model/UserWriteModel';
import { LoginUserHandler } from '../command-handler/LoginUserHandler';
import { UserReadModel } from '../read-model/UserReadModel';

const userWriteModel = new UserWriteModel();
export const commandBus = new CommandBus();
commandBus.registerCommandHandler(new LoginUserHandler(userWriteModel));
export const userReadModel = new UserReadModel(userWriteModel);
