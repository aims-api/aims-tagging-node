import { AxiosInstance } from 'axios'
import { UserCredentials } from '../../client/index.js'
import { DateTime, SubscriptionStatus } from '../../types/index.js'

type AuthenticateEndpoint = (
  request: AuthenticateRequest,
) => Promise<AuthenticateResponse>

interface AuthenticateRequest {
  userEmail: string
  userPassword: string
}

type ApiUserScopeKeys = 'api-user' | 'batch' | 'track'

type ApiUserScope = {
  [key in ApiUserScopeKeys]: Record<string, boolean>
}

interface ApiUserToken {
  token: string
  expirationDate: string
}

interface MonthlyRequestLimits {
  monthlyRequestLimit: number
  remainingMonthlyRequests: number
}

export interface AuthenticateResponse
  extends MonthlyRequestLimits,
  SubscriptionStatus {
  id: string
  lastLoginAt: DateTime | null
  scope: ApiUserScope
  token: ApiUserToken
}

const authenticate =
  (
    client: () => AxiosInstance,
    setCredentials: (credentials: UserCredentials) => void
  ): AuthenticateEndpoint =>
    async (request: AuthenticateRequest): Promise<AuthenticateResponse> => {
      const { userEmail, userPassword } = request
      const response = await client().post('/authenticate/', undefined, {
        headers: {
          Authorization: `Basic ${Buffer.from(
          `${userEmail}:${userPassword}`
        ).toString('base64')}`
        }
      })
      const responseData = response.data as AuthenticateResponse
      setCredentials({
        userEmail,
        userPassword,
        apiUserToken: responseData.token
      })
      return responseData
    }

export { ApiUserToken, authenticate, AuthenticateEndpoint }
