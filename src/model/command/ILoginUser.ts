import { ICommand } from './ICommand';

export interface ILoginUser extends ICommand {
    name: string;
    id: string;
    user: {
        sessionId: string;
        email: string;
        userName: string;
    };
}