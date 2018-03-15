export class User {
    public id: string;
    public externalId: {[authorizedVia: string]: any} = {};
    public email: string;
    public firstName: string;
    public lastName: string;
}
