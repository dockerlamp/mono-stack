import { ICommand } from '../../command-bus/ICommand';
import { ILoginUser } from '../service/ILoginUser';

export interface ILoginUserCommand extends ICommand {
    name: string;
    id: string;
    payload: ILoginUser;
}