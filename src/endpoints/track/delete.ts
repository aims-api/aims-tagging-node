import { PromiseWrapped, withHeaders } from '../../helpers/response.js'
import { ResponseStructureRequestParameters, Track } from '../../types/index.js'

import { AxiosInstance } from 'axios'

type DeleteEndpoint = (request: DeleteRequest) => PromiseWrapped<DeleteResponse>

interface DeleteRequest extends ResponseStructureRequestParameters {
  trackId: string
}

interface DeleteResponse extends Track {}

const deleteTrack = (client: () => AxiosInstance): DeleteEndpoint => async (
  request: DeleteRequest
): PromiseWrapped<DeleteResponse> => {
  const { trackId, responseStructure } = request
  const response = await client().delete(`/track/delete/${trackId}`, {
    params: { responseStructure }
  })
  return withHeaders(response.headers, response.data)
}

export { DeleteEndpoint, deleteTrack }
