import { Service } from 'typedi';

import { CommandBus } from './CommandBus';
import { LoginUserHandler } from '../user/command-handler/LoginUserHandler';

@Service()
export class CommandBusFactory {
    constructor(private loginUserHandler: LoginUserHandler) {}

    public create(): CommandBus {
        let commandBus = new CommandBus();
        commandBus.registerCommandHandler(this.loginUserHandler);

        return commandBus;
    }
}