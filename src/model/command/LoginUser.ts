import { ILoginUserCommand } from './ILoginUserCommand';
import { ILoginUser } from './ILoginUser';

export class LoginUserCommand implements ILoginUserCommand {
    public name: string = 'login-user';
    public id: string;
    public user: ILoginUser;
}