import { IWriteModelUserDocument } from './types';

export interface IUserRead {
    getUserByProvider(provider: string, providerUserId: string): Promise<IWriteModelUserDocument>;
    getUseByEmail(email: string): Promise<IWriteModelUserDocument>
}