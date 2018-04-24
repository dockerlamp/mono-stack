export interface IMongoConfig {
    host: string;
    port: number;
    user?: string;
    password?: string;
    database: string;
    options?: any;
}