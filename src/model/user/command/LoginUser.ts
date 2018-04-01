import * as uuid from 'uuid';

import { ILoginUserCommand } from './ILoginUserCommand';
import { ILoginUser } from './ILoginUser';

export class LoginUserCommand implements ILoginUserCommand {
    public name: string = 'login-user';
    public id: string;
    public user: ILoginUser;

    constructor() {
        this.id = uuid.v4();
    }
}