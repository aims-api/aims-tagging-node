import { SetupServerApi, setupServer } from 'msw/node'

import { handlers } from './handlers.js'

export const server: SetupServerApi = setupServer(...handlers)
