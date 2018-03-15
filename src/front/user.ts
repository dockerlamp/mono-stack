export class User {
    public id: string;
    public externalId: {[provider: string]: any} = {};
    public emails: string[];
    public firstName: string;
    public lastName: string;
}
