import { AxiosInstance } from 'axios'

type ChangePasswordEndpoint = (
  request: ChangePasswordRequest
) => Promise<ChangePasswordResponse>

interface ChangePasswordRequest {
  password: string
}

interface ChangePasswordResponse {
  status: string
}

const changePassword = (client: () => AxiosInstance): ChangePasswordEndpoint => async (
  request: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const { password } = request
  const response = await client().post('/api-user/change-password', {
    password
  })
  return response.data as ChangePasswordResponse
}

export { ChangePasswordEndpoint, changePassword }
