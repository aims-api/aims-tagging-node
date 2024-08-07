import { Batch, ResponseStructureRequestParameters } from '../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'

type DeleteEndpoint = (request: DeleteRequest) => PromiseWrapped<DeleteResponse>

interface DeleteRequest extends ResponseStructureRequestParameters {
  batchId: string
}

interface DeleteResponse extends Batch {}

const deleteBatch = (client: () => AxiosInstance): DeleteEndpoint => async (
  request: DeleteRequest
): PromiseWrapped<DeleteResponse> => {
  const { batchId, responseStructure } = request
  const response = await client().delete(`/batch/delete/${batchId}`, {
    params: { responseStructure }
  })
  return withHeaders(response.headers, response.data)
}

export { DeleteEndpoint, deleteBatch }
