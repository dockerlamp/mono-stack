module.exports = {
    globals: {
        'ts-jest': {
            tsConfigFile: 'tsconfig.json',
        },
    },
    moduleFileExtensions: [
        'js',
        'ts'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    collectCoverageFrom: [
        // collect coverage for src files without unit-test files
        'src/**/*.{ts,js}',
        '!src/**/*.test.{ts,js}',
    ],
    coveragePathIgnorePatterns: [
        // ignore coverage for libs
        '^/node_modules/',
        // ignore coverage for interface files
        '/I[A-Z].*',
    ]
};