import baseConfig from './jest.config'

const config = {
  ...baseConfig,
  testRegex: '/test/live_integration/.*\\.test\\.ts$',
  setupFilesAfterEnv: [],
}

console.log('RUNNING INTEGRATION TESTS')
export default config
