import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'
import type { FilterRequestParameters, ListRequestParameters, ResponseStructureRequestParameters, TaxonomyMappingPreset } from '../../types/index.js'

type GetTaxonomyPresetsRequest = ListRequestParameters &
ResponseStructureRequestParameters &
FilterRequestParameters

type GetTaxonomyPresetsEndpoint = (request?: GetTaxonomyPresetsRequest) => PromiseWrapped<GetTaxonomyPresetsResponse>
type GetTaxonomyPresetsResponse = TaxonomyMappingPreset[]

const getTaxonomyPresets = (client: () => AxiosInstance): GetTaxonomyPresetsEndpoint => async (request?: GetTaxonomyPresetsRequest
): PromiseWrapped<GetTaxonomyPresetsResponse> => {
  const { limit, orderBy, responseStructure } = request ?? {}
  const response = await client().get('/api-user/taxonomy-presets', { params: { limit, orderBy, responseStructure } })

  return withHeaders(response.headers, response.data)
}

export { GetTaxonomyPresetsEndpoint, getTaxonomyPresets }
