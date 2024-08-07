import { AxiosInstance } from 'axios'
import { DateTime } from '../../../index.js'
import { PromiseWrapped, withHeaders } from '../../../helpers/response.js'

type DeleteCategoryEndpoint = (
  request: string
) => PromiseWrapped<DeleteCategoryResponse>
interface DeleteCategoryResponse {
  id: string
  createdAt: DateTime
  name: string
  priority: number
}

const deleteCategory = (client: () => AxiosInstance): DeleteCategoryEndpoint => async (
  categoryId: string
): PromiseWrapped<DeleteCategoryResponse> => {
  const response = await client().delete(`/api-user-category/delete/${categoryId}`)
  return withHeaders(response.headers, response.data)
}

export { DeleteCategoryEndpoint, deleteCategory }
