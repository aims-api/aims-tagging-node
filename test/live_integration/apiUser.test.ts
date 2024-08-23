import { describe, expect, test } from '@jest/globals'
import { Client } from '../../src/client/index.js'
import { AuthenticateResponse } from '../../src/endpoints/authentication/authenticate.js'

describe('apiUser endpoints', () => {
  let authData: AuthenticateResponse
  let authenticatedTestClient: Client

  beforeAll(async () => {
    const clientData = {
      clientId: process.env.TEST_CLIENT_ID ?? '',
      clientSecret: process.env.TEST_CLIENT_SECRET ?? '',
    }

    authData = await new Client(
      clientData,
    ).endpoints.authentication.authenticate({
      userEmail: process.env.TEST_USER_EMAIL ?? '',
      userPassword: process.env.TEST_USER_PASSWORD ?? '',
    })

    authenticatedTestClient = new Client({
      ...clientData,
      apiUserToken: authData.token,
    })
  })

  test('remainingMonthlyRequests', async () => {
    const response =
      await authenticatedTestClient.endpoints.apiUser.remainingMonthlyRequests()

    expect(response).toEqual({
      user: {
        remainingMonthlyRequests: expect.any(Number),
        totalMonthlyRequests: expect.any(Number),
      },
      platform: {
        remainingMonthlyRequests: expect.any(Number),
        totalMonthlyRequests: expect.any(Number),
      },
    })
  })
})
