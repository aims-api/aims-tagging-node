import { AxiosInstance } from 'axios'

type RegisterEndpoint = (request: RegisterRequest) => Promise<RegisterResponse>

interface RegisterRequest {
  email: string
  password: string
}

interface RegisterResponse {
  login: string
  status: string
  user_id: string
}

const register = (client: () => AxiosInstance): RegisterEndpoint => async (
  request: RegisterRequest
): Promise<RegisterResponse> => {
  const { email, password } = request
  const response = await client().post('/registration/request/', {
    email,
    password
  })
  return response.data as RegisterResponse
}

export { RegisterEndpoint, register }
