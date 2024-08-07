import { PromiseWrapped, withHeaders } from '../../helpers/response.js'
import { ResponseStructureRequestParameters, Track } from '../../types/index.js'

import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import { ReadStream } from 'fs'

type TagEndpoint = (
  request: TrackTagRequest
) => PromiseWrapped<TrackTagResponse>

interface TrackTagRequest extends ResponseStructureRequestParameters {
  title: string
  audio: ReadStream
  hookUrl?: string
}

interface TrackTagResponse extends Track {}

const trackTag = (client: () => AxiosInstance): TagEndpoint => async (
  request: TrackTagRequest
): PromiseWrapped<TrackTagResponse> => {
  const { title, audio, hookUrl, responseStructure } = request
  const data = new FormData()
  data.append('title', title)
  data.append('audio', audio)
  if (typeof hookUrl !== 'undefined') {
    data.append('hook_url', hookUrl)
  }
  const response = await client().post('/track/tag/', data, {
    params: { responseStructure }
  })
  return withHeaders(response.headers, response.data)
}

export { TagEndpoint, trackTag }
