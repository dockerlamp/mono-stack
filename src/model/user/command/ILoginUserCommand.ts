import { ICommand } from '../../command-bus/ICommand';
import { ILoginUser } from './ILoginUser';

export interface ILoginUserCommand extends ICommand {
    name: string;
    id: string;
    payload: ILoginUser;
}