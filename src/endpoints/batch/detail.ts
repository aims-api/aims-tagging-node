import { Batch, ResponseStructureRequestParameters } from '../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'

type DetailEndpoint = (request: DetailRequest) => PromiseWrapped<DetailResponse>

interface DetailRequest extends ResponseStructureRequestParameters {
  batchId: string
  preset?: string
}

interface DetailResponse extends Batch {}

const batchDetail =
  (client: () => AxiosInstance): DetailEndpoint =>
    async (request: DetailRequest): PromiseWrapped<DetailResponse> => {
      const { batchId, preset, responseStructure } = request
      const response = await client().get(`/batch/detail/${batchId}`, {
        params: { preset, responseStructure }
      })

      return withHeaders(response.headers, response.data)
    }

export { DetailEndpoint, batchDetail }
