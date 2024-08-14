const config = require('./jest.config')
config.default.testRegex = '.*\\.itest\\.ts$'
config.default.setupFilesAfterEnv = []
console.log('RUNNING INTEGRATION TESTS')
module.exports = config
