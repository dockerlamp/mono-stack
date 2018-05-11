import { ILoginUser } from '../service/ILoginUser';
import { IUserDocument } from './IUser-types';

export interface IUserWrite {
    insertUser(userData: ILoginUser): Promise<IUserDocument>;
}