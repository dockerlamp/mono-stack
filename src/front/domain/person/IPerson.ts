export interface IEmail {
    email: string;
    default: boolean;
    authMethods?: string[];
}

export interface IPerson {
    firstname?: string;
    lastname?: string;
    emails: IEmail[];
}