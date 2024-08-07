import { AxiosInstance } from 'axios'
import { Mapping } from '../../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../../helpers/response.js'

type UpdateTaxonomyMappingEndpoint = (
  request: UpdateTaxonomyMappingRequest
) => PromiseWrapped<UpdateTaxonomyMappingResponse>

interface UpdateTaxonomyMappingRequest {
  mapping: Mapping
  isMappingEnabled: boolean
}
interface UpdateTaxonomyMappingResponse {
  mapping: Mapping
}

const updateTaxonomyMapping = (client: () => AxiosInstance): UpdateTaxonomyMappingEndpoint => async (
  request: UpdateTaxonomyMappingRequest
): PromiseWrapped<UpdateTaxonomyMappingResponse> => {
  const response = await client().post('/api-user/taxonomy-mapping', request)
  return withHeaders(response.headers, response.data)
}

export { UpdateTaxonomyMappingEndpoint, updateTaxonomyMapping }
