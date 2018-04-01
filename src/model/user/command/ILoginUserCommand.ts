import { ICommand } from './ICommand';
import { ILoginUser } from './ILoginUser';

export interface ILoginUserCommand extends ICommand {
    name: string;
    id: string;
    user: ILoginUser;
}