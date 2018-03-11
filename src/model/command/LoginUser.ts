import { ICommand } from './ICommand';

export class LoginUserCommand implements ICommand {
    public name: string = 'login-user';
    public id: string;

    public user: {
        sessionId: string;
        email: string;
        userName: string;
    };
}