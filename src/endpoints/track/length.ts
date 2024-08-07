import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'

type LengthEndpoint = () => PromiseWrapped<LengthResponse>

interface LengthResponse {
  length: number
}

const trackLength = (
  client: () => AxiosInstance
): LengthEndpoint => async (): PromiseWrapped<LengthResponse> => {
  const response = await client().get('/track/length/')
  return withHeaders(response.headers, response.data)
}

export { LengthEndpoint, trackLength }
