export interface ILoginUser {
    provider: string;
    providerUserId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
    displayName?: string;
}