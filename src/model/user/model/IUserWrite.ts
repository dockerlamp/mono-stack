import { ILoginUser } from '../service/ILoginUser';
import { IWriteModelUserDocument } from './types';

export interface IUserWrite {
    insertUser(userData: ILoginUser): Promise<IWriteModelUserDocument>;
}