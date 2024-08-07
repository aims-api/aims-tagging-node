import { PromiseWrapped, withHeaders } from '../../../helpers/response.js'

import { AxiosInstance } from 'axios'
import type { DateTime, ListRequestParameters, ResponseStructureRequestParameters } from '../../../types/index.js'

type GetCategoryListRequest = ListRequestParameters &
ResponseStructureRequestParameters

interface Category {
  id: string
  createdAt: DateTime
  name: string
  priority: number
}

type GetCategoryListEndpoint = (request?: GetCategoryListRequest) => PromiseWrapped<Category[]>

const getCategoryList = (client: () => AxiosInstance): GetCategoryListEndpoint => async (request?: GetCategoryListRequest
): PromiseWrapped<Category[]> => {
  const { limit, orderBy, responseStructure } = request ?? {}
  const response = await client().get('/api-user-category/list', { params: { limit, orderBy, responseStructure } })

  return withHeaders(response.headers, response.data)
}

export { GetCategoryListEndpoint, getCategoryList }
