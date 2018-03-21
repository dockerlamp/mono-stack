import { ICommandHandler } from './ICommandHandler';
import { UserWriteModel } from '../write-model/UserWriteModel';
import { LoginUserCommand } from '../command/LoginUser';
import { ILoginUserCommand } from '../command/ILoginUserCommand';

export class LoginUserHandler implements ICommandHandler {
    public name: string = 'login-user';

    constructor(private userModel: UserWriteModel) {
    }

    public async handle(command: ILoginUserCommand) {
        let id = await this.userModel.saveUser(command.user);
    }
}