const baseConfig = require('./config.common');

module.exports = {
    ...baseConfig,
    testMatch: [
        '<rootDir>/src/**/*.test.(ts|js)',
    ],
};