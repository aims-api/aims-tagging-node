import { describe, expect, test } from '@jest/globals'

import { authenticatedTestClient } from '../../client'

describe('health', () => {
  test('check', async () => {
    const response = await authenticatedTestClient.endpoints.health.health()
    expect(response).toEqual(['Nothing to see here. Move it along.'])
  })
})
