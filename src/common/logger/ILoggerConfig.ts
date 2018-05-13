export interface ILoggerConfig {
    options: {
        file: {
            level: string,
            filename: string,
            handleExceptions: boolean,
            json: boolean,
            maxsize: number,
            maxFiles: number,
            colorize: boolean,
        };
        console: {
            level: string,
            handleExceptions: boolean,
            json: boolean,
            colorize: boolean,
        }
    };
    useOption: string;
}