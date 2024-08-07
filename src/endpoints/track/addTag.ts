import {
  Categories,
  ResponseStructureRequestParameters,
  Track
} from '../../types/index.js'
import { PromiseWrapped, withHeaders } from '../../helpers/response.js'

import { AxiosInstance } from 'axios'

type AddTagEndpoint = (request: AddTagRequest) => PromiseWrapped<AddTagResponse>

interface AddTagRequest extends ResponseStructureRequestParameters {
  trackId: string
  category: Categories
  value: string
  preset?: string
}

interface AddTagResponse extends Track {}

const addTag =
  (client: () => AxiosInstance): AddTagEndpoint =>
    async (request: AddTagRequest): PromiseWrapped<AddTagResponse> => {
      const { trackId, category, value, responseStructure, preset } = request
      const response = await client().post(
      `/track/add-tag/${trackId}`,
      { category, value },
      {
        params: { responseStructure, preset }
      }
      )
      return withHeaders(response.headers, response.data)
    }

export { AddTagEndpoint, addTag }
