import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'
import type { FilterRequestParameters, ListRequestParameters, ResponseStructureRequestParameters, TaxonomyMappingPreset } from '../../types/index.js'

type TaxonomyPresetListRequest = ListRequestParameters &
ResponseStructureRequestParameters &
FilterRequestParameters

type TaxonomyPresetListEndpoint = (request?: TaxonomyPresetListRequest) => PromiseWrapped<TaxonomyPresetListResponse>
type TaxonomyPresetListResponse = TaxonomyMappingPreset[]

const taxonomyPresetList = (client: () => AxiosInstance): TaxonomyPresetListEndpoint => async (request?: TaxonomyPresetListRequest
): PromiseWrapped<TaxonomyPresetListResponse> => {
  const { limit, orderBy, responseStructure } = request ?? {}
  const response = await client().get('/taxonomy-preset/list', { params: { limit, orderBy, responseStructure } })

  return withHeaders(response.headers, response.data)
}

export { TaxonomyPresetListEndpoint, taxonomyPresetList }
