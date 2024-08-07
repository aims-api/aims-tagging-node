import { Batch, ResponseStructureRequestParameters } from '../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'
import FormData from 'form-data'

type CreateEndpoint = (request: CreateRequest) => PromiseWrapped<CreateResponse>

interface CreateRequest extends ResponseStructureRequestParameters {
  name: string
}

interface CreateResponse extends Batch {}

const createBatch = (client: () => AxiosInstance): CreateEndpoint => async (
  request: CreateRequest
): PromiseWrapped<CreateResponse> => {
  const { name, responseStructure } = request
  const data = new FormData()
  data.append('fields[name]', name)
  const response = await client().post('/batch/create/', data, {
    params: { responseStructure }
  })
  return withHeaders(response.headers, response.data)
}

export { CreateEndpoint, createBatch }
