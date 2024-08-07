import { AxiosInstance } from 'axios'

type RegisterEndpoint = (request: RegisterRequest) => Promise<RegisterResponse>

interface RegisterRequest {
  email: string
  password: string
}

interface RegisterResponse {
  status: string
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
