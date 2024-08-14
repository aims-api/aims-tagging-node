import { describe, expect, test } from '@jest/globals'
import { Client } from '../../src/client/index.js'

describe('Authenticate endpoint', () => {
  test('success, returns user data', async () => {
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

describe('Batch length endpoint', () => {
  test('success, returns existing batch count', async () => {
    const testClient = new Client({
      clientId: process.env.TEST_CLIENT_ID ?? '',
      clientSecret: process.env.TEST_CLIENT_SECRET ?? '',
      // userEmail: process.env.TEST_USER_EMAIL ?? '',
      // userPassword: process.env.TEST_USER_PASSWORD ?? '',
     })
    const response = await testClient.endpoints.batch.length()
    expect(response).toEqual({
      data: expect.objectContaining({
        length: expect.any(Number)
      }),
      userData: {
        remainingRequests: expect.any(String),
      }
    })
  })
})