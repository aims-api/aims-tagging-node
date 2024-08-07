import { PromiseWrapped, withHeaders } from '../../../helpers/response.js'

import { AxiosInstance } from 'axios'
import type { CustomTag, ListRequestParameters, ResponseStructureRequestParameters } from '../../../types/index.js'

type GetTagListRequest = ListRequestParameters &
ResponseStructureRequestParameters

type GetTagListEndpoint = (request?: GetTagListRequest) => PromiseWrapped<CustomTag[]>

const getTagList = (client: () => AxiosInstance): GetTagListEndpoint => async (request?: GetTagListRequest
): PromiseWrapped<CustomTag[]> => {
  const { limit, orderBy, responseStructure } = request ?? {}
  const response = await client().get('/api-user-tag/list', { params: { limit, orderBy, responseStructure } })

  return withHeaders(response.headers, response.data)
}

export { GetTagListEndpoint, getTagList }
