import { describe, expect, test } from '@jest/globals'
import { Client } from '../../src/client/index.js'

describe('Authenticate endpoint', () => {
  test('success, returns data', async () => {
    const testClient = new Client({
     clientId: process.env.TEST_CLIENT_ID ?? '',
     clientSecret: process.env.TEST_CLIENT_SECRET ?? '',
    })

    const response = await testClient.endpoints.authentication.authenticate({
      userEmail: process.env.TEST_USER_EMAIL ?? '',
      userPassword: process.env.TEST_USER_PASSWORD ?? '',
    })
  
    expect(response).toMatchObject({
      id: expect.any(String),
      token: expect.any(Object),
      remainingMonthlyRequests: expect.any(Number),
    })
  })
})