import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'
import { ResponseStructureRequestParameters } from '../../index.js'

interface ApplyPromoCodeRequest extends ResponseStructureRequestParameters {
  code: string
}
interface ApplyPromoCodeResponse {
  message: string
}

type ApplyPromoCodeEndpoint = (
  request: ApplyPromoCodeRequest
) => PromiseWrapped<ApplyPromoCodeResponse>

const applyPromoCode = (client: () => AxiosInstance): ApplyPromoCodeEndpoint => async (
  request: ApplyPromoCodeRequest
): PromiseWrapped<ApplyPromoCodeResponse> => {
  const { code } = request
  const response = await client().post('/api-user/apply-promo-code', { code })

  return withHeaders(response.headers, response.data)
}

export { ApplyPromoCodeEndpoint, applyPromoCode }
