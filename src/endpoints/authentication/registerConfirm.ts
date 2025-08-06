import { AxiosInstance } from 'axios'

type RegisterConfirmEndpoint = (
  request: RegisterConfirmRequest
) => Promise<RegisterConfirmResponse>

interface RegisterConfirmRequest {
  id: string
}

interface RegisterConfirmResponse {
  login: string
  status: string
  user_id: string
}

const registerConfirm = (
  client: () => AxiosInstance
): RegisterConfirmEndpoint => async (
  request: RegisterConfirmRequest
): Promise<RegisterConfirmResponse> => {
  const { id } = request
  const response = await client().post(`/registration/confirm/${id}`)
  return response.data as RegisterConfirmResponse
}

export { RegisterConfirmEndpoint, registerConfirm }
