import { Schema, Document } from 'mongoose';

// export interface IProviderIdentifier {
//     name: string;
//     value: string;
// }

export interface IWriteModelUser {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    providerIds: {
        github: string;
    };
    sessionIds: string[];
}

// export interface IWriteModelUserDocument extends IWriteModelUser, Document {}
export type IWriteModelUserDocument = IWriteModelUser & Document;
// export type IProviderIdentifierDocument = IProviderIdentifier & Document;

// tslint:disable-next-line variable-name
// let ProviderIdentifiersSchema = new Schema({
//     providerId: String,
//     value: String
// });

// tslint:disable-next-line variable-name
export const WriteModelUserSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    name: String,
    sessionIds: [ String ],
    providerIds: {
        type: {
            github: String,
        }
    }
});
