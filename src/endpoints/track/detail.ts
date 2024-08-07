import { PromiseWrapped, withHeaders } from '../../helpers/response.js'
import { ResponseStructureRequestParameters, Track } from '../../types/index.js'

import { AxiosInstance } from 'axios'

type DetailEndpoint = (request: DetailRequest) => PromiseWrapped<DetailResponse>

interface DetailRequest extends ResponseStructureRequestParameters {
  trackId: string
  preset?: string
}

interface DetailResponse extends Track {}

const trackDetail = (client: () => AxiosInstance): DetailEndpoint => async (
  request: DetailRequest
): PromiseWrapped<DetailResponse> => {
  const { trackId, preset, responseStructure } = request
  const response = await client().get(`/track/detail/${trackId}`, {
    params: { preset, responseStructure }
  })
  return withHeaders(response.headers, response.data)
}

export { DetailEndpoint, DetailResponse, trackDetail }
