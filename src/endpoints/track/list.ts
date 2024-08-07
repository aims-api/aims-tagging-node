import {
  FilterRequestParameters,
  ListRequestParameters,
  ResponseStructureRequestParameters,
  Track
} from '../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'

type ListEndpoint = (request?: ListRequest) => PromiseWrapped<ListResponse>

type ListRequest = ListRequestParameters &
ResponseStructureRequestParameters &
FilterRequestParameters

type ListResponse = Track[]

const trackList = (client: () => AxiosInstance): ListEndpoint => async (
  request?: ListRequest
): PromiseWrapped<ListResponse> => {
  const { limit, orderBy, responseStructure } = request ?? {}

  const { headers, data } = await client().get('/track/list/', {
    params: { limit, orderBy, responseStructure }
  })
  return withHeaders(headers, data)
}

export { ListEndpoint, trackList }
