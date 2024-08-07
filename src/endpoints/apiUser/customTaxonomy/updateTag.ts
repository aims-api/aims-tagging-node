import { AxiosInstance } from 'axios'
import { PromiseWrapped, withHeaders } from '../../../helpers/response.js'
import { CustomTag, ResponseStructureRequestParameters } from '../../../types/index.js'

type UpdateTagEndpoint = (
  request: UpdateTagRequest
) => PromiseWrapped<CustomTag>

interface UpdateTagRequest extends ResponseStructureRequestParameters {
  id: string
  data: {
    value?: string
    enabled?: boolean
    category: string | null
    apiUserCategory: string | null
  }
}

const updateTag = (client: () => AxiosInstance): UpdateTagEndpoint => async (
  request: UpdateTagRequest
): PromiseWrapped<CustomTag> => {
  const response = await client().post(`/api-user-tag/update/${request.id}`, { fields: request.data, responseStructure: request.responseStructure })
  return withHeaders(response.headers, response.data)
}

export { UpdateTagEndpoint, updateTag }
