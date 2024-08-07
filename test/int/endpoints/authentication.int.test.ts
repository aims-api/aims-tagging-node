import {
  anonymousTestClient,
  invalidUserEmail,
  invalidUserPassword,
  validUserEmail,
  validUserPassword
} from '../../client'
import { describe, expect, test } from '@jest/globals'

import { AxiosError } from 'axios'

describe('authentication endpoint call', () => {
  test('authenticate with valid credentials to retrieve a valid token', async () => {
    const response = await anonymousTestClient.endpoints.authentication.authenticate(
      {
        userEmail: validUserEmail,
        userPassword: validUserPassword
      }
    )
    expect(response).toEqual(
      expect.objectContaining({
        token: {
          token: expect.any(String),
          expirationDate: expect.stringMatching(
            /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+\d{2}:\d{2}(\.\d+)?)?/
          )
        },
        userScope: expect.any(Object),
        monthlyRequestLimit: expect.any(Number),
        remainingMonthlyRequests: expect.any(Number)
      })
    )
  })
  test('authenticate with invalid credentials to get an error', async () => {
    await expect(
      anonymousTestClient.endpoints.authentication.authenticate({
        userEmail: invalidUserEmail,
        userPassword: invalidUserPassword
      })
    ).rejects.toThrowError(AxiosError)
  })
})
