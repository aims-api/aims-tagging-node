import { PromiseWrapped, withHeaders } from '../../helpers/response.js'
import {
  ResponseStructureRequestParameters,
  Track
} from '../../types/index.js'

import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import { ReadStream } from 'fs'

type AddTrackEndpoint = (
  request: AddTrackRequest
) => PromiseWrapped<AddTrackResponse>

interface AddTrackRequest extends ResponseStructureRequestParameters {
  batchId: string
  audio: ReadStream
}

interface AddTrackResponse extends Track {}

const addTrack =
  (client: () => AxiosInstance): AddTrackEndpoint =>
    async (request: AddTrackRequest): PromiseWrapped<AddTrackResponse> => {
      const { batchId, audio, responseStructure } = request
      const data = new FormData()
      data.append('audio', audio)
      const response = await client().post(`/batch/add-track/${batchId}`, data, {
        params: { responseStructure },
        headers: {
          ...data.getHeaders()
        }
      })
      return withHeaders(response.headers, response.data)
    }

export { AddTrackEndpoint, addTrack }
