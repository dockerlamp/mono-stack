import { IUser } from './IUser-types';

export interface IUserRead {
    getUserByProvider(provider: string, providerUserId: string): Promise<IUser>;
    getUseByEmail(email: string): Promise<IUser>;
}