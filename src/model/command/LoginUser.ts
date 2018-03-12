import { ILoginUser } from './ILoginUser';

export class LoginUserCommand implements ILoginUser {
    public name: string = 'login-user';
    public id: string;

    public user: {
        sessionId: string;
        email: string;
        userName: string;
    };
}