import {
  DateTime,
  ResponseStructureRequestParameters,
  ListRequestParameters
} from '../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'

type CategoryListEndpoint = (
  request?: CategoryListRequest
) => PromiseWrapped<CategoryListResponse>

type CategoryListRequest = ListRequestParameters & ResponseStructureRequestParameters

interface Category {
  id: string
  priority: number
  name?: string
  tags?: Array<{
    id: string
    createdAt: DateTime
    value: string
    supported: boolean
  }>
}

type CategoryListResponse = Category[]

const categoryList = (client: () => AxiosInstance): CategoryListEndpoint => async (
  request?: CategoryListRequest
): PromiseWrapped<CategoryListResponse> => {
  const { responseStructure, orderBy } = request ?? {}
  const response = await client().get('/category/list/', {
    params: { responseStructure, orderBy }
  })
  return withHeaders(response.headers, response.data)
}

export { CategoryListEndpoint, categoryList }
