import { AxiosInstance } from 'axios'

type RemainingMonthlyRequestsEndpoint = () => Promise<
RemainingMonthlyRequestsResponse
>

interface MonthlyRequestsParameters {
  remainingMonthlyRequests: number
  totalMonthlyRequests: number
}

interface RemainingMonthlyRequestsResponse {
  user: MonthlyRequestsParameters
  platform: MonthlyRequestsParameters
}

const remainingMonthlyRequests = (
  client: () => AxiosInstance
): RemainingMonthlyRequestsEndpoint => async (): Promise<
RemainingMonthlyRequestsResponse
> => {
  const response = await client().get('/api-user/remaining-monthly-requests/')
  return response.data as RemainingMonthlyRequestsResponse
}

export { RemainingMonthlyRequestsEndpoint, remainingMonthlyRequests }
