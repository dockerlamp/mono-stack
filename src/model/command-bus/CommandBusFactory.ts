import { Service } from 'typedi';
import * as winston from 'winston';

import { CommandBus } from './CommandBus';
import { Logger } from '../../common/logger/Logger';

@Service()
export class CommandBusFactory {
    constructor(@Logger() private logger: winston.Logger) {
    }
    public create(): CommandBus {
        let commandBus = new CommandBus(this.logger);
        // here we can register commands handlers:
        // commandBus.registerCommandHandler(this.loginUserHandler);

        return commandBus;
    }
}