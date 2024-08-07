import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'

export interface WrappedResponse<T> {
  data: T
  userData: {
    remainingRequests?: string
  }
}

export type PromiseWrapped<T> = Promise<WrappedResponse<T>>

type AxiosHeaders =
  | AxiosResponseHeaders
  | Partial<RawAxiosResponseHeaders>

export const withHeaders = <TArg>(
  headers: AxiosHeaders,
  response: TArg
): WrappedResponse<TArg> => {
  const remainingRequests = headers['x-remaining-requests']

  return { data: response, userData: { remainingRequests } }
}
