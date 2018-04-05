import { Schema, Document } from 'mongoose';

export interface IWriteModelUser {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    providerIds: {
        github: string;
    };
}

export type IWriteModelUserDocument = IWriteModelUser & Document;

// tslint:disable-next-line variable-name
export const WriteModelUserSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    name: String,
    providerIds: {
        type: {
            github: String,
        }
    }
});
