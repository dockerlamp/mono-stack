const consoleLogFunctionNames = [
    'log',
    'info',
    'warn',
    'error',
    'debug',
];

let defaultLoggerFunctions = {};
consoleLogFunctionNames.forEach((logFunctionName) => {
    consoleLogFunctionNames[logFunctionName] = console[logFunctionName];
});

export class Logger {
    public static disableConsoleLogger() {
        consoleLogFunctionNames.forEach((logFunctionName) => {
            console[logFunctionName] = () => {
                // disable log
            };
        });
    }
}

if (process.env.DISABLE_CONSOLE_LOGGER) {
    Logger.disableConsoleLogger();
}