import { AxiosInstance } from 'axios'
import { DateTime } from '../../../index.js'
import { PromiseWrapped, withHeaders } from '../../../helpers/response.js'

type UpdateCategoryEndpoint = (
  request: UpdateCategoryRequest
) => PromiseWrapped<UpdateCategoryResponse>

interface UpdateCategoryRequest {
  id: string
  data: {
    name?: string
    priority?: number
  }
}

interface UpdateCategoryResponse {
  id: string
  createdAt: DateTime
  name: string
  priority: number
}

const updateCategory = (client: () => AxiosInstance): UpdateCategoryEndpoint => async (
  request: UpdateCategoryRequest
): PromiseWrapped<UpdateCategoryResponse> => {
  const response = await client().post(`/api-user-category/update/${request.id}`, {
    fields: request.data
  })
  return withHeaders(response.headers, response.data)
}

export { UpdateCategoryEndpoint, updateCategory }
