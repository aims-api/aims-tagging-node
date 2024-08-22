const config = require('./jest.config')
config.default.testRegex = '/test/live_integration/.*\\.test\\.ts$'
config.default.setupFilesAfterEnv = []
console.log('RUNNING INTEGRATION TESTS')
module.exports = config
