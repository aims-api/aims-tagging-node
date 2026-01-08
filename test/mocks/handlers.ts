import { http, HttpResponse, HttpHandler } from 'msw'
import {
  validApiUserToken,
  validClientId,
  validClientSecret,
  validUserEmail,
  validUserPassword
} from '../client.js'

import { API_HOST } from '../../src/client/index.js'
import { Categories } from '../../src/types/index.js'

const GENERIC_ERROR_MESSAGE = {
  message:
    'Client id, secret or user api token are invalid, expired or not allowed access!'
}
const NOT_FOUND_ERROR_MESSAGE = {
  message: "The requested item doesn't exist!",
  errors: []
}
const INVALID_DATA_ERROR_MESSAGE = {
  message: 'Item is not valid!',
  errors: [
    {
      property: 'name',
      message: 'This value should not be blank.'
    }
  ]
}
const GENERIC_HEADERS = {
  'x-remaining-requests': '99'
}

const GENERIC_USER_DATA = {
  remainingRequests: '99'
}

const GENERIC_BATCH_RESPONSE = {
  id:
    process.env.TEST_AUTO_TAGGING_API_BATCH_ID ??
    '123456ab-7890-12cd-ef34-a5b6789012ec3',
  name: process.env.TEST_AUTO_TAGGING_API_BATCH_NAME ?? 'Polka Dance Melodies'
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
    instruments: ['acoustic guitar', 'guitar']
  },
  filesize: 12345678,
  duration: 45,
  processedAt: '2022-01-01T12:34:56+01:00',
  hookUrl: null,
  modelVersion: 'ab12c3'
}

const GENERIC_REMAINING_MONTHLY_REQUESTS_RESPONSE = {
  user: {
    remainingMonthlyRequests: 100,
    totalMonthlyRequests: 100
  },
  platform: {
    remainingMonthlyRequests: 100,
    totalMonthlyRequests: 100
  }
}

const getCredentials = (
  request: Request
): {
  clientId: string | null
  clientSecret: string | null
  apiUserToken: string | null
} => {
  const clientId = request.headers.get('X-Client-Id')
  const clientSecret = request.headers.get('X-Client-Secret')
  const apiUserToken = request.headers.get('X-Api-User-Token')
  return { clientId, clientSecret, apiUserToken }
}

const isUserCredentialsValid = (request: Request): boolean => {
  const auth = request.headers.get('Authorization')
  if (auth === null) {
    return false
  }
  const hash = auth.replace(/Basic\s+/i, '')
  const [userEmail, userPassword] = Buffer.from(hash, 'base64')
    .toString('ascii')
    .split(':')
  return userEmail === validUserEmail && userPassword === validUserPassword
}

const isCredentialsValidAsAnonymous = (request: Request): boolean => {
  const { clientId, clientSecret } = getCredentials(request)
  return clientId === validClientId && clientSecret === validClientSecret
}

const isCredentialsValidAsAuthenticated = (request: Request): boolean => {
  const { apiUserToken } = getCredentials(request)
  return (
    isCredentialsValidAsAnonymous(request) && apiUserToken === validApiUserToken
  )
}

const handlers: HttpHandler[] = [
  // api user
  http.get(
    `${API_HOST}/api-user/remaining-monthly-requests/`,
    ({ request }) => {
      if (isCredentialsValidAsAuthenticated(request)) {
        return HttpResponse.json(GENERIC_REMAINING_MONTHLY_REQUESTS_RESPONSE)
      }
      return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
    }
  ),

  // authentication
  http.post(`${API_HOST}/authenticate/`, ({ request }) => {
    if (
      isCredentialsValidAsAnonymous(request) &&
      isUserCredentialsValid(request)
    ) {
      return HttpResponse.json({
        token: {
          token: 'abcd',
          expirationDate: '2022-01-01T12:34:56+01:00'
        },
        userScope: {},
        monthlyRequestLimit: 500,
        remainingMonthlyRequests: 395
      })
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),

  // batch
  http.post(`${API_HOST}/batch/add-track/:batchId`, async ({ request }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      const data = await request.arrayBuffer()
      // FIXME: msw seems to be unable to parse FormData, just expect file of certain size for now
      if (data.byteLength > 1000) {
        return HttpResponse.json(GENERIC_TRACK_RESPONSE, {
          headers: GENERIC_HEADERS
        })
      }
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),
  http.post(`${API_HOST}/batch/create/`, async ({ request }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      const formData = await request.formData()
      const name = formData.get('fields[name]')
      if (name !== null) {
        return HttpResponse.json(
          { ...GENERIC_BATCH_RESPONSE, name },
          { headers: GENERIC_HEADERS }
        )
      }
      return HttpResponse.json(INVALID_DATA_ERROR_MESSAGE, { status: 400 })
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),
  http.delete(`${API_HOST}/batch/delete/:batchId`, ({ request, params }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      const { batchId } = params
      if (batchId === GENERIC_BATCH_RESPONSE.id) {
        return HttpResponse.json(GENERIC_BATCH_RESPONSE, {
          headers: GENERIC_HEADERS
        })
      }
      return HttpResponse.json(NOT_FOUND_ERROR_MESSAGE, { status: 404 })
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),
  http.get(`${API_HOST}/batch/detail/:batchId`, ({ request, params }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      const { batchId } = params
      if (batchId === GENERIC_BATCH_RESPONSE.id) {
        return HttpResponse.json(GENERIC_BATCH_RESPONSE, {
          headers: GENERIC_HEADERS
        })
      }
      return HttpResponse.json(NOT_FOUND_ERROR_MESSAGE, { status: 404 })
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),
  http.get(`${API_HOST}/batch/export/:batchId`, ({ request, params }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      const { batchId } = params
      if (batchId === GENERIC_BATCH_RESPONSE.id) {
        return HttpResponse.text(GENERIC_BATCH_CSV)
      }
      return HttpResponse.json(NOT_FOUND_ERROR_MESSAGE, { status: 404 })
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),
  http.get(`${API_HOST}/batch/length/`, ({ request }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      return HttpResponse.json({ length: 10 }, { headers: GENERIC_HEADERS })
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),
  http.get(`${API_HOST}/batch/list`, ({ request }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      return HttpResponse.json(
        [
          GENERIC_BATCH_RESPONSE,
          GENERIC_BATCH_RESPONSE,
          GENERIC_BATCH_RESPONSE
        ],
        { headers: GENERIC_HEADERS }
      )
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),
  http.post(
    `${API_HOST}/batch/start-tagging/:batchId`,
    ({ request, params }) => {
      if (isCredentialsValidAsAuthenticated(request)) {
        const { batchId } = params
        if (batchId === GENERIC_BATCH_RESPONSE.id) {
          return HttpResponse.json(GENERIC_BATCH_RESPONSE, {
            headers: GENERIC_HEADERS
          })
        }
        return HttpResponse.json(NOT_FOUND_ERROR_MESSAGE, { status: 404 })
      }
      return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
    }
  ),
  http.post(`${API_HOST}/batch/update/:batchId`, ({ request, params }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      const { batchId } = params
      if (batchId === GENERIC_BATCH_RESPONSE.id) {
        return HttpResponse.json(GENERIC_BATCH_RESPONSE, {
          headers: GENERIC_HEADERS
        })
      }
      return HttpResponse.json(NOT_FOUND_ERROR_MESSAGE, { status: 404 })
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),

  // health
  http.get(`${API_HOST}/health/`, () => {
    return HttpResponse.json(['Nothing to see here. Move it along.'])
  }),

  // track
  http.delete(`${API_HOST}/track/delete/:trackId`, ({ request, params }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      const { trackId } = params
      if (trackId === GENERIC_TRACK_RESPONSE.id) {
        return HttpResponse.json(GENERIC_TRACK_RESPONSE, {
          headers: GENERIC_HEADERS
        })
      }
      return HttpResponse.json(NOT_FOUND_ERROR_MESSAGE, { status: 404 })
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),
  http.get(`${API_HOST}/track/detail/:trackId`, ({ request, params }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      const { trackId } = params
      if (trackId === GENERIC_TRACK_RESPONSE.id) {
        return HttpResponse.json(GENERIC_TRACK_RESPONSE, {
          headers: GENERIC_HEADERS
        })
      }
      return HttpResponse.json(NOT_FOUND_ERROR_MESSAGE, { status: 404 })
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),
  http.get(`${API_HOST}/track/length/`, ({ request }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      return HttpResponse.json({ length: 10 }, { headers: GENERIC_HEADERS })
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),
  http.get(`${API_HOST}/track/list/`, ({ request }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      return HttpResponse.json(
        [
          GENERIC_TRACK_RESPONSE,
          GENERIC_TRACK_RESPONSE,
          GENERIC_TRACK_RESPONSE
        ],
        { headers: GENERIC_HEADERS }
      )
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  }),
  http.post(
    `${API_HOST}/track/add-tag/:trackId`,
    async ({ request, params }) => {
      if (isCredentialsValidAsAuthenticated(request)) {
        const { trackId } = params
        if (trackId === GENERIC_TRACK_RESPONSE.id) {
          const { category, value } = (await request.json()) as {
            category: string
            value: string
          }
          if (typeof category !== 'undefined' && typeof value !== 'undefined') {
            return HttpResponse.json(
              {
                ...GENERIC_TRACK_RESPONSE,
                tags: {
                  ...GENERIC_TRACK_RESPONSE.tags,
                  [category]: [
                    ...GENERIC_TRACK_RESPONSE.tags[category as Categories],
                    value
                  ]
                }
              },
              { headers: GENERIC_HEADERS }
            )
          }
          return HttpResponse.json(INVALID_DATA_ERROR_MESSAGE, { status: 400 })
        }
        return HttpResponse.json(NOT_FOUND_ERROR_MESSAGE, { status: 404 })
      }
      return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
    }
  ),
  http.post(
    `${API_HOST}/track/remove-tag/:trackId`,
    async ({ request, params }) => {
      if (isCredentialsValidAsAuthenticated(request)) {
        const { trackId } = params
        if (trackId === GENERIC_TRACK_RESPONSE.id) {
          const { category, value } = (await request.json()) as {
            category: string
            value: string
          }
          if (typeof category !== 'undefined' && typeof value !== 'undefined') {
            return HttpResponse.json(
              {
                ...GENERIC_TRACK_RESPONSE,
                tags: {
                  ...GENERIC_TRACK_RESPONSE.tags,
                  [category]: GENERIC_TRACK_RESPONSE.tags[
                    category as Categories
                  ].filter(item => item !== value)
                }
              },
              { headers: GENERIC_HEADERS }
            )
          }
          return HttpResponse.json(INVALID_DATA_ERROR_MESSAGE, { status: 400 })
        }
        return HttpResponse.json(NOT_FOUND_ERROR_MESSAGE, { status: 404 })
      }
      return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
    }
  ),
  http.post(`${API_HOST}/track/tag/`, async ({ request }) => {
    if (isCredentialsValidAsAuthenticated(request)) {
      const data = await request.arrayBuffer()
      // FIXME: msw seems to be unable to parse FormData, just expect file of certain size for now
      if (data.byteLength > 1000) {
        return HttpResponse.json(GENERIC_TRACK_RESPONSE, {
          headers: GENERIC_HEADERS
        })
      }
    }
    return HttpResponse.json(GENERIC_ERROR_MESSAGE, { status: 403 })
  })
]

export {
  handlers,
  GENERIC_USER_DATA,
  GENERIC_BATCH_CSV,
  GENERIC_BATCH_RESPONSE,
  GENERIC_ERROR_MESSAGE,
  GENERIC_TRACK_RESPONSE
}
