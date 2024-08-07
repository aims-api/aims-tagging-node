import { AxiosInstance } from 'axios'

type RequestPasswordResetEndpoint = (
  request: RequestPasswordResetRequest
) => Promise<RequestPasswordResetResponse>

interface RequestPasswordResetRequest {
  email: string
}

interface RequestPasswordResetResponse {
  message: string
}

const requestPasswordReset = (
  client: () => AxiosInstance
): RequestPasswordResetEndpoint => async (
  request: RequestPasswordResetRequest
): Promise<RequestPasswordResetResponse> => {
  const { email } = request
  const response = await client().post('/resetting/request/', {
    email
  })

  const parsedResponse: RequestPasswordResetResponse = Array.isArray(
    response.data
  )
    ? { message: response.data[0] as string }
    : { message: response.data.message }

  return parsedResponse
}

export { RequestPasswordResetEndpoint, requestPasswordReset }
