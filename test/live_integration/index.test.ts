import { describe, expect, test } from '@jest/globals'
import { Client } from '../../src/client/index.js'
import { AuthenticateResponse } from '../../src/endpoints/authentication/authenticate.js'

describe('Endpoints that require authentication', () => {
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

  test('success, returns count of all batches', async () => {
    const response = await authenticatedTestClient.endpoints.batch.length()

    expect(response).toEqual({
      data: expect.objectContaining({
        length: expect.any(Number),
      }),
      userData: {
        remainingRequests: expect.any(String),
      },
    })
  })

  test('success, returns all categories', async () => {
    const response = await authenticatedTestClient.endpoints.category.list()

    expect(response).toEqual({
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          priority: expect.any(Number),
        }),
      ]),
      userData: {
        remainingRequests: expect.any(String),
      },
    })
  })
})
