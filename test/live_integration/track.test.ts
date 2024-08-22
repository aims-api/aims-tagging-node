import { describe, expect, test } from '@jest/globals'
import { Client } from '../../src/client/index.js'
import { AuthenticateResponse } from '../../src/endpoints/authentication/authenticate.js'
import fs from 'fs'
import { Track } from '../../src/index.js'

describe('track endpoints', () => {
  let authData: AuthenticateResponse
  let authenticatedTestClient: Client

  beforeAll(async () => {
    const clientData = {
      clientId: process.env.TEST_CLIENT_ID ?? '',
      clientSecret: process.env.TEST_CLIENT_SECRET ?? '',
    }

    authData = await new Client(
      clientData,
    ).endpoints.authentication.authenticate({
      userEmail: process.env.TEST_USER_EMAIL ?? '',
      userPassword: process.env.TEST_USER_PASSWORD ?? '',
    })

    authenticatedTestClient = new Client({
      ...clientData,
      apiUserToken: authData.token,
    })
  })

  test('tag, detail and delete', async () => {
    const tagResponse = await authenticatedTestClient.endpoints.track.tag({
      title: 'test',
      audio: fs.createReadStream('./test/data/sample.mp3'),
    })

    const taggedTrack = tagResponse.data

    expect(tagResponse).toMatchObject({
      data: expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
        title: expect.any(String),
        filesize: expect.any(Number),
      }),
    })

    if (taggedTrack.id === undefined) {
      return
    }
    const detailResponse = await authenticatedTestClient.endpoints.track.detail(
      {
        trackId: taggedTrack.id,
      },
    )

    expect(detailResponse.data).toEqual(taggedTrack)

    const deleteResponse = await authenticatedTestClient.endpoints.track.delete(
      {
        trackId: taggedTrack.id,
      },
    )
    expect(deleteResponse.data).toEqual(taggedTrack)
  })
})
