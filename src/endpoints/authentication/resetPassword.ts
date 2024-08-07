import { AxiosInstance } from 'axios'

type ResetPasswordEndpoint = (
  request: ResetPasswordRequest
) => Promise<ResetPasswordResponse>

interface ResetPasswordRequest {
  password: string
  token: string
}

interface ResetPasswordResponse {
  message: string
}

const resetPassword = (client: () => AxiosInstance): ResetPasswordEndpoint => async (
  request: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const { password, token } = request
  const response = await client().post(`/resetting/reset/${token}`, {
    password
  })
  const parsedResponse: ResetPasswordResponse = Array.isArray(response.data)
    ? { message: response.data[0] as string }
    : { message: response.data.message }
  return parsedResponse
}

export { ResetPasswordEndpoint, resetPassword }
