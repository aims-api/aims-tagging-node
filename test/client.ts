import { Client } from '../src/client/'

const invalidClientId = 'client_id_invalid'
const invalidClientSecret = 'client_secret_invalid'
const invalidApiUserToken = 'api_user_token_invalid'
const invalidUserEmail = 'invalid@aims.com'
const invalidUserPassword = 'invalid_password'

const validClientId =
  process.env.TEST_AUTO_TAGGING_API_CLIENT_ID ?? 'client_id_valid'
const validClientSecret =
  process.env.TEST_AUTO_TAGGING_API_CLIENT_SECRET ?? 'client_secret_valid'
const validApiUserToken =
  process.env.TEST_AUTO_TAGGING_API_API_USER_TOKEN ?? 'api_user_token_valid'
const validUserEmail =
  process.env.TEST_AUTO_TAGGING_API_USER_EMAIL ?? 'valid@aims.com'
const validUserPassword =
  process.env.TEST_AUTO_TAGGING_API_USER_PASSWORD ?? 'valid_password'

const expiredDate = new Date()
expiredDate.setFullYear(expiredDate.getFullYear() - 1)

const validDate = new Date()
validDate.setFullYear(validDate.getFullYear() + 1)

const noCredentialsTestClient = new Client()

const invalidClientTestClient = new Client({
  clientId: invalidClientId,
  clientSecret: invalidClientSecret,
  ipAddr: 'ipAddr'
})

const anonymousTestClient = new Client({
  clientId: validClientId,
  clientSecret: validClientSecret,
  ipAddr: 'ipAddr'
})

const invalidUserTestClient = new Client({
  clientId: validClientId,
  clientSecret: validClientSecret,
  ipAddr: 'ipAddr'
})
invalidUserTestClient.credentials.setApiUserToken({
  token: invalidApiUserToken,
  expirationDate: new Date().toISOString()
})

const expiredUserTestClient = new Client({
  clientId: validClientId,
  clientSecret: validClientSecret,
  ipAddr: 'ipAddr'
})
expiredUserTestClient.credentials.setApiUserToken({
  token: validApiUserToken,
  expirationDate: expiredDate.toISOString()
})

const authenticatedTestClient = new Client({
  clientId: validClientId,
  clientSecret: validClientSecret,
  ipAddr: 'ipAddr'
})
authenticatedTestClient.credentials.setApiUserToken({
  token: validApiUserToken,
  expirationDate: validDate.toISOString()
})

export {
  noCredentialsTestClient,
  invalidClientTestClient,
  anonymousTestClient,
  invalidUserTestClient,
  expiredUserTestClient,
  authenticatedTestClient,
  invalidUserEmail,
  invalidUserPassword,
  validUserEmail,
  validUserPassword,
  validClientId,
  validClientSecret,
  validApiUserToken
}
