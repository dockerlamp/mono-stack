import { Service } from 'typedi';
import * as _ from 'lodash';

import { ICommandHandler } from '../../command-bus/ICommandHandler';
import { ILoginUserCommand } from '../command/ILoginUserCommand';
import { UserService } from '../service/UserService';

@Service()
export class LoginUserHandler implements ICommandHandler {
    public name: string = 'login-user';

    constructor(private userService: UserService) {
    }

    public async handle(command: ILoginUserCommand): Promise<void> {
        await this.userService.login(command.payload);
    }
}