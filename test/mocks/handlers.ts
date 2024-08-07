import {
  DefaultBodyType,
  PathParams,
  RestHandler,
  RestRequest,
  rest,
} from 'msw'
import {
  validApiUserToken,
  validClientId,
  validClientSecret,
  validUserEmail,
  validUserPassword,
} from '../client.js'

import { API_HOST } from '../../src/client/index.js'
import { Categories } from '../../src/types/index.js'

const GENERIC_ERROR_MESSAGE = {
  message:
    'Client id, secret or user api token are invalid, expired or not allowed access!',
}
const NOT_FOUND_ERROR_MESSAGE = {
  message: "The requested item doesn't exist!",
  errors: [],
}
const INVALID_DATA_ERROR_MESSAGE = {
  message: 'Item is not valid!',
  errors: [
    {
      property: 'name',
      message: 'This value should not be blank.',
    },
  ],
}
const GENERIC_HEADERS = {
  'x-remaining-requests': '99',
}

const GENERIC_USER_DATA = {
  remainingRequests: '99',
}

const GENERIC_BATCH_RESPONSE = {
  id:
    process.env.TEST_AUTO_TAGGING_API_BATCH_ID ??
    '123456ab-7890-12cd-ef34-a5b6789012ec3',
  name: process.env.TEST_AUTO_TAGGING_API_BATCH_NAME ?? 'Polka Dance Melodies',
}
const GENERIC_BATCH_CSV =
  'filename,bpm,key,moods,genres,usages,vocals,decades,instruments\n' +
  '00003_LACA-9697-03.wav,100,"[""C minor""]","[""film score""]","[""tension"",""dramatic"",""ominous""]","[""crime"",""thriller"",""drama"",""catastrophes""]","[""instrumental""]","[""2010s""]","[""strings"",""piano"",""bass"",""drums"",""percussion"",""sound effects"",""synth""]"\n' +
  'Hothouse-Lightshafts.wav,121,"[""E minor""]","[""indie rock""]","[""driving"",""determined"",""aggressive""]","[""sports"",""drama"",""parties""]","[""vocal"",""male vocal""]","[""2010s""]","[""bass"",""guitar"",""drums"",""electric guitar""]"\n' +
  'NoFear.wav,136,"[""E minor""]","[""hip hop""]","[""tension"",""dark"",""mysterious"",""sexy""]","[""drama"",""documentary"",""thriller""]","[""instrumental""]","[""2010s""]","[""bass"",""guitar"",""drums"",""electric guitar"",""synth""]"\n' +
  '000197974f3cb1b8e98699903649c0c6.mp3,92,"[""D major""]","[""folk pop""]","[""warm"",""affectionate"",""positive"",""tender"",""reflective""]","[""love"",""christmas"",""children"",""lifestyle""]","[""vocal"",""female vocal""]","[""2010s""]","[""piano"",""bass"",""acoustic guitar"",""guitar"",""drums""]"\n'

const GENERIC_TRACK_RESPONSE = {
  id: '648ef0db-cc55-442c-86bf-1245cf77341e',
  title: 'Rock the Boat',
  tags: {
    bpm: 100,
    key: ['C major'],
    moods: ['positive', 'relaxed', 'reflective'],
    genres: ['contemporary folk'],
    usages: ['travel', 'lifestyle', 'cooking'],
    vocals: ['instrumental'],
    decades: ['2010s'],
    tempo: ['medium'],
    instruments: ['acoustic guitar', 'guitar'],
  },
  filesize: 12345678,
  duration: 45,
  processedAt: '2022-01-01T12:34:56+01:00',
  hookUrl: null,
  modelVersion: 'ab12c3',
}

const GENERIC_REMAINING_MONTHLY_REQUESTS_RESPONSE = {
  user: {
    remainingMonthlyRequests: 100,
    totalMonthlyRequests: 100,
  },
  platform: {
    remainingMonthlyRequests: 100,
    totalMonthlyRequests: 100,
  },
}

const getCredentials = (
  req: RestRequest<DefaultBodyType, PathParams<string>>,
): {
  clientId: string | null
  clientSecret: string | null
  apiUserToken: string | null
} => {
  const clientId = req.headers.get('X-Client-Id')
  const clientSecret = req.headers.get('X-Client-Secret')
  const apiUserToken = req.headers.get('X-Api-User-Token')
  return { clientId, clientSecret, apiUserToken }
}

const isUserCredentialsValid = (
  req: RestRequest<DefaultBodyType, PathParams<string>>,
): boolean => {
  const auth = req.headers.get('Authorization')
  if (auth === null) {
    return false
  }
  const hash = auth.replace(/Basic\s+/i, '')
  const [userEmail, userPassword] = Buffer.from(hash, 'base64')
    .toString('ascii')
    .split(':')
  return userEmail === validUserEmail && userPassword === validUserPassword
}

const isCredentialsValidAsAnonymous = (
  req: RestRequest<DefaultBodyType, PathParams<string>>,
): boolean => {
  const { clientId, clientSecret } = getCredentials(req)
  return clientId === validClientId && clientSecret === validClientSecret
}

const isCredentialsValidAsAuthenticated = (
  req: RestRequest<DefaultBodyType, PathParams<string>>,
): boolean => {
  const { apiUserToken } = getCredentials(req)
  return (
    isCredentialsValidAsAnonymous(req) && apiUserToken === validApiUserToken
  )
}

const handlers: RestHandler[] = [
  // api user
  rest.get(
    `${API_HOST}/api-user/remaining-monthly-requests/`,
    (req, res, ctx) => {
      if (isCredentialsValidAsAuthenticated(req)) {
        return res(
          ctx.status(200),
          ctx.json(GENERIC_REMAINING_MONTHLY_REQUESTS_RESPONSE),
        )
      }
      return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
    },
  ),

  // authentication
  rest.post(`${API_HOST}/authenticate/`, (req, res, ctx) => {
    if (isCredentialsValidAsAnonymous(req) && isUserCredentialsValid(req)) {
      return res(
        ctx.status(200),
        ctx.json({
          token: {
            token: 'abcd',
            expirationDate: '2022-01-01T12:34:56+01:00',
          },
          userScope: {},
          monthlyRequestLimit: 500,
          remainingMonthlyRequests: 395,
        }),
      )
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),

  // batch
  rest.post(`${API_HOST}/batch/add-track/:batchId`, async (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const data = await req.arrayBuffer()
      // FIXME: msw seems to be unable to parse FormData, just expect file of certain size for now
      if (data.byteLength > 1000) {
        return await res(
          ctx.status(200),
          ctx.set(GENERIC_HEADERS),
          ctx.json(GENERIC_TRACK_RESPONSE),
        )
      }
    }
    return await res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.post(`${API_HOST}/batch/create/`, async (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const name = (req.body as Record<string, string>)['fields[name]']
      if (typeof name !== 'undefined') {
        return await res(
          ctx.status(200),
          ctx.set(GENERIC_HEADERS),
          ctx.json({ ...GENERIC_BATCH_RESPONSE, name }),
        )
      }
      return await res(ctx.status(400), ctx.json(INVALID_DATA_ERROR_MESSAGE))
    }
    return await res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.delete(`${API_HOST}/batch/delete/:batchId`, (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const { batchId } = req.params
      if (batchId === GENERIC_BATCH_RESPONSE.id) {
        return res(
          ctx.status(200),
          ctx.set(GENERIC_HEADERS),
          ctx.json(GENERIC_BATCH_RESPONSE),
        )
      }
      return res(ctx.status(404), ctx.json(NOT_FOUND_ERROR_MESSAGE))
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.get(`${API_HOST}/batch/detail/:batchId`, (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const { batchId } = req.params
      if (batchId === GENERIC_BATCH_RESPONSE.id) {
        return res(
          ctx.status(200),
          ctx.set(GENERIC_HEADERS),
          ctx.json(GENERIC_BATCH_RESPONSE),
        )
      }
      return res(ctx.status(404), ctx.json(NOT_FOUND_ERROR_MESSAGE))
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.get(`${API_HOST}/batch/export/:batchId`, (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const { batchId } = req.params
      if (batchId === GENERIC_BATCH_RESPONSE.id) {
        return res(ctx.status(200), ctx.text(GENERIC_BATCH_CSV))
      }
      return res(ctx.status(404), ctx.json(NOT_FOUND_ERROR_MESSAGE))
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.get(`${API_HOST}/batch/length/`, (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      return res(
        ctx.status(200),
        ctx.set(GENERIC_HEADERS),
        ctx.json({
          length: 10,
        }),
      )
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.get(`${API_HOST}/batch/list`, (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      return res(
        ctx.status(200),
        ctx.set(GENERIC_HEADERS),
        ctx.json([
          GENERIC_BATCH_RESPONSE,
          GENERIC_BATCH_RESPONSE,
          GENERIC_BATCH_RESPONSE,
        ]),
      )
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.post(`${API_HOST}/batch/start-tagging/:batchId`, (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const { batchId } = req.params
      if (batchId === GENERIC_BATCH_RESPONSE.id) {
        return res(
          ctx.status(200),
          ctx.set(GENERIC_HEADERS),
          ctx.json(GENERIC_BATCH_RESPONSE),
        )
      }
      return res(ctx.status(404), ctx.json(NOT_FOUND_ERROR_MESSAGE))
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.post(`${API_HOST}/batch/update/:batchId`, (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const { batchId } = req.params
      if (batchId === GENERIC_BATCH_RESPONSE.id) {
        return res(
          ctx.status(200),
          ctx.set(GENERIC_HEADERS),
          ctx.json(GENERIC_BATCH_RESPONSE),
        )
      }
      return res(ctx.status(404), ctx.json(NOT_FOUND_ERROR_MESSAGE))
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),

  // health
  rest.get(`${API_HOST}/health/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(['Nothing to see here. Move it along.']),
    )
  }),

  // track
  rest.delete(`${API_HOST}/track/delete/:trackId`, (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const { trackId } = req.params
      if (trackId === GENERIC_TRACK_RESPONSE.id) {
        return res(
          ctx.status(200),
          ctx.set(GENERIC_HEADERS),
          ctx.json(GENERIC_TRACK_RESPONSE),
        )
      }
      return res(ctx.status(404), ctx.json(NOT_FOUND_ERROR_MESSAGE))
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.get(`${API_HOST}/track/detail/:trackId`, (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const { trackId } = req.params
      if (trackId === GENERIC_TRACK_RESPONSE.id) {
        return res(
          ctx.status(200),
          ctx.set(GENERIC_HEADERS),
          ctx.json(GENERIC_TRACK_RESPONSE),
        )
      }
      return res(ctx.status(404), ctx.json(NOT_FOUND_ERROR_MESSAGE))
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.get(`${API_HOST}/track/length/`, (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      return res(
        ctx.status(200),
        ctx.set(GENERIC_HEADERS),
        ctx.json({
          length: 10,
        }),
      )
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.get(`${API_HOST}/track/list/`, (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      return res(
        ctx.status(200),
        ctx.set(GENERIC_HEADERS),
        ctx.json([
          GENERIC_TRACK_RESPONSE,
          GENERIC_TRACK_RESPONSE,
          GENERIC_TRACK_RESPONSE,
        ]),
      )
    }
    return res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.post(`${API_HOST}/track/add-tag/:trackId`, async (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const { trackId } = req.params
      if (trackId === GENERIC_TRACK_RESPONSE.id) {
        const { category, value } = await req.json()
        if (typeof category !== 'undefined' && typeof value !== 'undefined') {
          return await res(
            ctx.status(200),
            ctx.set(GENERIC_HEADERS),
            ctx.json({
              ...GENERIC_TRACK_RESPONSE,
              tags: {
                ...GENERIC_TRACK_RESPONSE.tags,
                [category]: [
                  ...GENERIC_TRACK_RESPONSE.tags[category as Categories],
                  value,
                ],
              },
            }),
          )
        }
        return await res(ctx.status(400), ctx.json(INVALID_DATA_ERROR_MESSAGE))
      }
      return await res(ctx.status(404), ctx.json(NOT_FOUND_ERROR_MESSAGE))
    }
    return await res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.post(`${API_HOST}/track/remove-tag/:trackId`, async (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const { trackId } = req.params
      if (trackId === GENERIC_TRACK_RESPONSE.id) {
        const { category, value } = await req.json()
        if (typeof category !== 'undefined' && typeof value !== 'undefined') {
          return await res(
            ctx.status(200),
            ctx.set(GENERIC_HEADERS),
            ctx.json({
              ...GENERIC_TRACK_RESPONSE,
              tags: {
                ...GENERIC_TRACK_RESPONSE.tags,
                [category]: GENERIC_TRACK_RESPONSE.tags[
                  category as Categories
                ].filter((item) => item !== value),
              },
            }),
          )
        }
        return await res(ctx.status(400), ctx.json(INVALID_DATA_ERROR_MESSAGE))
      }
      return await res(ctx.status(404), ctx.json(NOT_FOUND_ERROR_MESSAGE))
    }
    return await res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
  rest.post(`${API_HOST}/track/tag/`, async (req, res, ctx) => {
    if (isCredentialsValidAsAuthenticated(req)) {
      const data = await req.arrayBuffer()
      // FIXME: msw seems to be unable to parse FormData, just expect file of certain size for now
      if (data.byteLength > 1000) {
        return await res(
          ctx.status(200),
          ctx.set(GENERIC_HEADERS),
          ctx.json(GENERIC_TRACK_RESPONSE),
        )
      }
    }
    return await res(ctx.status(403), ctx.json(GENERIC_ERROR_MESSAGE))
  }),
]

export {
  handlers,
  GENERIC_USER_DATA,
  GENERIC_BATCH_CSV,
  GENERIC_BATCH_RESPONSE,
  GENERIC_ERROR_MESSAGE,
  GENERIC_TRACK_RESPONSE,
}
