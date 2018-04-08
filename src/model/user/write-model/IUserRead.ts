import { IWriteModelUser } from './types';

export interface IUserRead {
    getUserByProvider(provider: string, providerUserId: string): Promise<IWriteModelUser>;
    getUseByEmail(email: string): Promise<IWriteModelUser>;
}