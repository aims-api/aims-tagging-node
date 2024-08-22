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

  test('tag, detail and delete', () => {
    let taggedTrack: Track

    it('tag', async () => {
      const response = await authenticatedTestClient.endpoints.track.tag({
        title: 'test',
        audio: fs.createReadStream('./test/data/sample.mp3'),
      })

      taggedTrack = response.data

      expect(response).toEqual({
        data: expect.objectContaining({
          id: expect.any(String),
          createdAt: expect.any(String),
          title: expect.any(String),
          filesize: expect.any(Number),
        }),
      })

      it('detail', async () => {
        if (taggedTrack.id === undefined) {
          return
        }
        const response = await authenticatedTestClient.endpoints.track.detail({
          trackId: taggedTrack.id,
        })

        expect(response.data).toEqual(taggedTrack)
      })

      it('delete', async () => {
        if (taggedTrack.id === undefined) {
          return
        }
        const response = await authenticatedTestClient.endpoints.track.delete({
          trackId: taggedTrack.id,
        })
        console.log(response)
        expect(response.data).toEqual(taggedTrack)
      })
    })
  })
})
