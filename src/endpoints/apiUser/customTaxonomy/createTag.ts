import { AxiosInstance } from 'axios'
import { PromiseWrapped, withHeaders } from '../../../helpers/response.js'
import { CustomTag, ResponseStructureRequestParameters } from '../../../types/index.js'

type CreateTagEndpoint = (
  request: CreateTagRequest
) => PromiseWrapped<CustomTag>

interface AIMSCategory {
  category: string
}
interface CustomCategory {
  apiUserCategory: string
}

type CreateTagRequestData = { value: string } & (AIMSCategory | CustomCategory)
type CreateTagRequest = { data: CreateTagRequestData } & ResponseStructureRequestParameters

const createTag = (client: () => AxiosInstance): CreateTagEndpoint => async (
  request: CreateTagRequest
): PromiseWrapped<CustomTag> => {
  const response = await client().post('/api-user-tag/create', {
    fields: request.data,
    responseStructure: request.responseStructure
  })
  return withHeaders(response.headers, response.data)
}

export { CreateTagEndpoint, createTag }
