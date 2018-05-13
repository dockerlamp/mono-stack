export let config = {
    options: {
        file: {
            level: 'info',
            filename: `logs/monostack.log`,
            handleExceptions: true,
            json: true,
            maxsize: 5242880,
            maxFiles: 5,
            colorize: false,
        },
        console: {
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
        }
    },
    useOption: 'console'
};
