import { AxiosInstance } from 'axios'

type HealthEndpoint = () => Promise<HealthResponse>

type HealthResponse = string[]

const health = (client: () => AxiosInstance): HealthEndpoint => async (): Promise<
HealthResponse
> => {
  const response = await client().get('/health/')
  return response.data as HealthResponse
}

export { HealthEndpoint, health }
