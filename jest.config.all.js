const baseConfig = require('./jest.config.common');

module.exports = {
    ...baseConfig,
    testMatch: [
        '<rootDir>/src/**/*.test.(ts|js)',
        '<rootDir>/test/integration/**/*.test.(ts|js)',
    ],
};