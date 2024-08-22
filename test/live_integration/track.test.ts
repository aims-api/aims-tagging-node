import { describe, expect, test } from '@jest/globals'
import { Client } from '../../src/client/index.js'
import { AuthenticateResponse } from '../../src/endpoints/authentication/authenticate.js'

describe('track endpoints', () => {
  let authData: AuthenticateResponse
  let authenticatedTestClient: Client

  beforeAll(async () => {
    const clientData = {
      clientId: 'it8u1n29P7rnY0-d',
      clientSecret: 'Xjye6axPtFcu_9luhmUC_BYbLDQsiD0a',
    }

    authData = await new Client(
      clientData,
    ).endpoints.authentication.authenticate({
      userEmail: 'moyefi4113@larland.com',
      userPassword: 'VfhvHj57VJEXUh',
    })

    console.log(authData)

    authenticatedTestClient = new Client({
      ...clientData,
      apiUserToken: authData.token,
    })
  })

  test('trackDetail', async () => {
    const response = await authenticatedTestClient.endpoints.track.detail({
      trackId: '',
    })

    console.log(response)

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
