import { ICommandHandler } from '../../command-bus/ICommandHandler';
import { UserWriteModel } from '../write-model/UserWriteModel';
import { LoginUserCommand } from '../command/LoginUser';
import { ILoginUserCommand } from '../command/ILoginUserCommand';

export class LoginUserHandler implements ICommandHandler {
    public name: string = 'login-user';

    constructor(private userModel: UserWriteModel) {
    }

    public async handle(command: ILoginUserCommand) {
        // get user by provider id
        let {provider, providerUserId, email} = command.payload;
        let user = await this.userModel.getUserByProvider(provider, providerUserId);
        if (!user && email) {
            // get user by email
            user = await this.userModel.getUseByEmail(email);
        }
        if (user) {
            // if exist then update only fields which does nod exists in user
            // ...compare
            if (!user.providerIds[provider]) {
                user.providerIds[provider] = providerUserId;
            }
            // let updateData = {};
            // let compareFields = [];
            if (user.isModified) {
                await user.save();
            }
        } else {
            // if doesnt exists add new user
            await this.userModel.saveUser(command.payload);
        }
    }
}