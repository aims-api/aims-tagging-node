import { Batch, ResponseStructureRequestParameters } from '../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'
import FormData from 'form-data'

type UpdateEndpoint = (request: UpdateRequest) => PromiseWrapped<UpdateResponse>

interface UpdateRequest extends ResponseStructureRequestParameters {
  batchId: string
  name: string
}

interface UpdateResponse extends Batch {}

const updateBatch = (client: () => AxiosInstance): UpdateEndpoint => async (
  request: UpdateRequest
): PromiseWrapped<UpdateResponse> => {
  const { batchId, name, responseStructure } = request
  const data = new FormData()
  data.append('fields[name]', name)
  const response = await client().post(`/batch/update/${batchId}`, data, {
    params: { responseStructure }
  })
  return withHeaders(response.headers, response.data)
}

export { UpdateEndpoint, updateBatch }
