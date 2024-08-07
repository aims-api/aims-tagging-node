import { AxiosInstance } from 'axios'
import { Mapping } from '../../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../../helpers/response.js'

type GetTaxonomyMappingEndpoint = () => PromiseWrapped<GetTaxonomyMappingResponse>

interface GetTaxonomyMappingResponse {
  mapping: Mapping
  isMappingEnabled: boolean
}

const getTaxonomyMapping = (
  client: () => AxiosInstance
): GetTaxonomyMappingEndpoint => async (): PromiseWrapped<
GetTaxonomyMappingResponse
> => {
  const response = await client().get('/api-user/taxonomy-mapping/')
  return withHeaders(response.headers, response.data)
}

export { GetTaxonomyMappingEndpoint, getTaxonomyMapping }
