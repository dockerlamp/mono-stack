const baseConfig = require('./config.common');

module.exports = {
    ...baseConfig,
    testMatch: [
        '<rootDir>/test/integration/**/*.test.(ts|js)',
    ],
};