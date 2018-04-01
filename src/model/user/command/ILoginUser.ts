export interface ILoginUser {
    sessionId: string;
    provider: string;
    providerUserId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
}