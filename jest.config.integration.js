const baseConfig = require('./jest.config.common');

module.exports = {
    ...baseConfig,
    testMatch: [
        '<rootDir>/test/integration/**/*.test.(ts|js)',
    ],
};