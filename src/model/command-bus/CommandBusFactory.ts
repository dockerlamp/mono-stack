import { Service } from 'typedi';

import { CommandBus } from './CommandBus';

@Service()
export class CommandBusFactory {
    public create(): CommandBus {
        let commandBus = new CommandBus();
        // here we can register commands handlers:
        // commandBus.registerCommandHandler(this.loginUserHandler);

        return commandBus;
    }
}