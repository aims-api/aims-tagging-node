import {
  Categories,
  ResponseStructureRequestParameters,
  Track
} from '../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'

type RemoveTagEndpoint = (
  request: RemoveTagRequest
) => PromiseWrapped<RemoveTagResponse>

interface RemoveTagRequest extends ResponseStructureRequestParameters {
  trackId: string
  category: Categories
  value: string
  preset?: string
}

interface RemoveTagResponse extends Track {}

const removeTag = (client: () => AxiosInstance): RemoveTagEndpoint => async (
  request: RemoveTagRequest
): PromiseWrapped<RemoveTagResponse> => {
  const { trackId, category, value, responseStructure, preset } = request
  const response = await client().post(
    `/track/remove-tag/${trackId}`,
    { category, value },
    {
      params: { responseStructure, preset }
    }
  )
  return withHeaders(response.headers, response.data)
}

export { RemoveTagEndpoint, removeTag }
