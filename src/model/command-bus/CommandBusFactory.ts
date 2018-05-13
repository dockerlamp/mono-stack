import { Service } from 'typedi';

import { CommandBus } from './CommandBus';
import { Logger } from '../../common/logger/Logger';

@Service()
export class CommandBusFactory {
    constructor(
        private logging: Logger,
    ) {
    }
    public create(): CommandBus {
        let commandBus = new CommandBus(this.logging);
        // here we can register commands handlers:
        // commandBus.registerCommandHandler(this.loginUserHandler);

        return commandBus;
    }
}