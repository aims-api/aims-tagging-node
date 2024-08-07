import { AxiosInstance } from 'axios'
import { PromiseWrapped, withHeaders } from '../../../helpers/response.js'
import { CustomTag } from '../../../types/index.js'

type DeleteTagEndpoint = (
  request: string
) => PromiseWrapped<CustomTag>

const deleteTag = (client: () => AxiosInstance): DeleteTagEndpoint => async (
  tagId: string
): PromiseWrapped<CustomTag> => {
  const response = await client().delete(`/api-user-tag/delete/${tagId}`)
  return withHeaders(response.headers, response.data)
}

export { DeleteTagEndpoint, deleteTag }
