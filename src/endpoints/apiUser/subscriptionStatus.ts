import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'
import type { SubscriptionStatus } from '../../types/index.js'

type SubscriptionStatusEndpoint = (
) => PromiseWrapped<SubscriptionStatusResponse>

interface SubscriptionStatusResponse extends SubscriptionStatus {}

const subscriptionStatus = (client: () => AxiosInstance): SubscriptionStatusEndpoint => async (
): PromiseWrapped<SubscriptionStatusResponse> => {
  const response = await client().get('/api-user/subscription-status/')

  return withHeaders(response.headers, response.data)
}

export { SubscriptionStatusEndpoint, subscriptionStatus }
