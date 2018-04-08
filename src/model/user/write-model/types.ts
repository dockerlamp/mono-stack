import { Schema, Document } from 'mongoose';

export interface IWriteModelUser {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    userName?: string;
    providerIds: {
        github: string;
        facebook: string;
        google: string;
    };
}

export type IWriteModelUserDocument = IWriteModelUser & Document;

// tslint:disable-next-line variable-name
export const WriteModelUserSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    displayName: String,
    userName: String,
    providerIds: {
        github: String,
        facebook: String,
        google: String,
    }
});
