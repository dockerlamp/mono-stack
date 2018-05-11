import { ILoginUser } from '../service/ILoginUser';
import { IUserDocument } from './types';

export interface IUserWrite {
    insertUser(userData: ILoginUser): Promise<IUserDocument>;
}