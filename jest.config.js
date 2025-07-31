// jest.config.js
module.exports = {
    testEnvironment: 'node', // Porque es backend, no browser
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'], // Archivo que se ejecuta antes de cada test
    testTimeout: 10000 // 10 segundos máximo por test
};