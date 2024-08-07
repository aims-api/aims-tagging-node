import { Batch, ResponseStructureRequestParameters } from '../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'

type StartTaggingEndpoint = (
  request: StartTaggingRequest
) => PromiseWrapped<StartTaggingResponse>

interface StartTaggingRequest extends ResponseStructureRequestParameters {
  batchId: string
}

interface StartTaggingResponse extends Batch {}

const startTagging = (client: () => AxiosInstance): StartTaggingEndpoint => async (
  request: StartTaggingRequest
): PromiseWrapped<StartTaggingResponse> => {
  const { batchId, responseStructure } = request
  const response = await client().post(
    `/batch/start-tagging/${batchId}`,
    undefined,
    {
      params: { responseStructure }
    }
  )
  return withHeaders(response.headers, response.data)
}

export { StartTaggingEndpoint, startTagging }
