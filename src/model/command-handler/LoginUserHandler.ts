import { ICommandHandler } from './ICommandHandler';
import { ICommand } from '../command/ICommand';
import { UserWriteModel } from '../write-model/UserWriteModel';
import { LoginUserCommand } from '../command/LoginUser';

export class LoginUserHandler implements ICommandHandler {
    public name: string = 'login-user';

    constructor(private userModel: UserWriteModel) {
    }

    public async handle(command: ICommand) {
        let userLoginCommand: LoginUserCommand = (command as LoginUserCommand);
        let id = await this.userModel.saveUser(userLoginCommand.user);
        console.log(`command ${userLoginCommand.name} handled, userId = ${id}`);
    }
}