import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'
import { ResponseStructureRequestParameters } from '../../index.js'

interface StripeAccountDataRequest extends ResponseStructureRequestParameters {
  id: string
}
interface StripeAccountDataResponse {
  message: string
}

type StripeAccountDataEndpoint = (request: StripeAccountDataRequest
) => PromiseWrapped<StripeAccountDataResponse>

const stripeAccountData = (client: () => AxiosInstance): StripeAccountDataEndpoint => async (request: StripeAccountDataRequest
): PromiseWrapped<StripeAccountDataResponse> => {
  const { id } = request
  const response = await client().post('/api-user/stripe-account-data/', { id })

  return withHeaders(response.headers, response.data)
}

export { StripeAccountDataEndpoint, stripeAccountData }
