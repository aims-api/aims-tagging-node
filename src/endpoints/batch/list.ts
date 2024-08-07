import {
  Batch,
  FilterRequestParameters,
  ListRequestParameters,
  ResponseStructureRequestParameters
} from '../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'

type ListEndpoint = (request?: ListRequest) => PromiseWrapped<ListResponse>

type ListRequest = ListRequestParameters &
ResponseStructureRequestParameters &
FilterRequestParameters & {
  preset?: string
}

type ListResponse = Batch[]

const batchList = (client: () => AxiosInstance): ListEndpoint => async (
  request?: ListRequest
): PromiseWrapped<ListResponse> => {
  const { preset, limit, orderBy, responseStructure } = request ?? {}
  const response = await client().get('/batch/list', {
    params: { preset, limit, orderBy, responseStructure }
  })
  return withHeaders(response.headers, response.data)
}

export { ListEndpoint, batchList }
