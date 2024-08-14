import { describe, expect, test } from '@jest/globals'

import { authenticatedTestClient } from '../../client'

describe('api user', () => {
  describe('remaining monthly requests', () => {
    test('successfully fetch remaining monthly request counts', async () => {
      const response = await authenticatedTestClient.endpoints.apiUser.remainingMonthlyRequests()
      expect(response).toEqual(
        expect.objectContaining({
          user: {
            remainingMonthlyRequests: expect.any(Number),
            totalMonthlyRequests: expect.any(Number)
          },
          platform: {
            remainingMonthlyRequests: expect.any(Number),
            totalMonthlyRequests: expect.any(Number)
          }
        })
      )
    })
  })
})
