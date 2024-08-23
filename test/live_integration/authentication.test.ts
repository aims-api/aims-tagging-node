import { describe, expect, test } from '@jest/globals'
import { Client } from '../../src/client/index.js'

describe('Authenticate endpoint', () => {
  test('success, returns data', async () => {
    const response = await new Client({
      clientId: process.env.TEST_CLIENT_ID ?? '',
      clientSecret: process.env.TEST_CLIENT_SECRET ?? '',
    }).endpoints.authentication.authenticate({
      userEmail: process.env.TEST_USER_EMAIL ?? '',
      userPassword: process.env.TEST_USER_PASSWORD ?? '',
    })

    expect(response).toMatchObject({
      id: expect.any(String),
      lastLoginAt: expect.any(String),
      remainingMonthlyRequests: expect.any(Number),
    })
  })
})
