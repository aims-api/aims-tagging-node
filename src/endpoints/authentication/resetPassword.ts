import { AxiosInstance } from 'axios'

type ResetPasswordEndpoint = (
  request: ResetPasswordRequest
) => Promise<ResetPasswordResponse>

interface ResetPasswordRequest {
  password: string
  token: string
}

interface ResetPasswordResponse {
  login: string,
  status: string,
  user_id: string
}

const resetPassword = (client: () => AxiosInstance): ResetPasswordEndpoint => async (
  request: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const { password, token } = request
  const response = await client().post(`/resetting/reset/${token}`, {
    password
  })
  const parsedResponse: ResetPasswordResponse = Array.isArray(response.data)
    ? response.data[0]
    : response.data
  return parsedResponse
}

export { ResetPasswordEndpoint, resetPassword }
