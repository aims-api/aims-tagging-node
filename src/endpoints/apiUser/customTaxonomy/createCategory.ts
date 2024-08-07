import { AxiosInstance } from 'axios'
import { DateTime } from '../../../index.js'
import { PromiseWrapped, withHeaders } from '../../../helpers/response.js'

type CreateCategoryEndpoint = (
  request: CreateCategoryRequest
) => PromiseWrapped<CreateCategoryResponse>

interface CreateCategoryRequest {
  name: string
  priority: number
}
interface CreateCategoryResponse {
  id: string
  createdAt: DateTime
  name: string
  priority: number
}

const createCategory = (client: () => AxiosInstance): CreateCategoryEndpoint => async (
  request: CreateCategoryRequest
): PromiseWrapped<CreateCategoryResponse> => {
  const response = await client().post('/api-user-category/create', {
    fields: request
  })
  return withHeaders(response.headers, response.data)
}

export { CreateCategoryEndpoint, createCategory }
