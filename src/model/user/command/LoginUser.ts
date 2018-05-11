import * as uuid from 'uuid';

import { ILoginUserCommand } from './ILoginUserCommand';
import { ILoginUser } from '../service/ILoginUser';

/**
 * @deprecated
 */
class LoginUserCommand implements ILoginUserCommand {
    public name: string = 'login-user';
    public id: string;
    public payload: ILoginUser;

    constructor() {
        this.id = uuid.v4();
    }
}