import {
  ApiUserToken,
  AuthenticateEndpoint,
  authenticate
} from './authenticate.js'
import { RegisterConfirmEndpoint, registerConfirm } from './registerConfirm.js'
import { RegisterEndpoint, register } from './register.js'
import {
  RequestPasswordResetEndpoint,
  requestPasswordReset
} from './requestPasswordReset.js'
import { ResetPasswordEndpoint, resetPassword } from './resetPassword.js'
interface AuthenticationEndpoints {
  authenticate: AuthenticateEndpoint
  register: RegisterEndpoint
  registerConfirm: RegisterConfirmEndpoint
  requestPasswordReset: RequestPasswordResetEndpoint
  resetPassword: ResetPasswordEndpoint
}

export {
  AuthenticationEndpoints,
  ApiUserToken,
  authenticate,
  register,
  registerConfirm,
  requestPasswordReset,
  resetPassword
}
