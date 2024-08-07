import '../../../jestMatchers/toBeNumberOrNull'

import { Categories, Track } from '../../../src/types/index.js'
import {
  GENERIC_TRACK_RESPONSE,
  GENERIC_USER_DATA
} from '../../mocks/handlers.js'
import { describe, expect, test } from '@jest/globals'

import { AxiosError } from 'axios'
import { DetailResponse } from '../../../src/endpoints/track/detail.js'
import { WrappedResponse } from '../../../src/helpers/response.js'
import { authenticatedTestClient } from '../../client'
import fs from 'fs'
import path from 'path'
import { sleep } from 'sleep'

describe('track', () => {
  let track: Track

  describe('tag', () => {
    test('successfully add a track to tagging queue', async () => {
      const response = await authenticatedTestClient.endpoints.track.tag({
        title: GENERIC_TRACK_RESPONSE.title,
        audio: fs.createReadStream(path.resolve('test/data/sample.mp3'))
      })
      expect(response).toEqual({
        data: expect.objectContaining({
          id: expect.any(String),
          title: GENERIC_TRACK_RESPONSE.title,
          modelVersion: expect.any(String)
        }),
        userData: GENERIC_USER_DATA
      })
      track = response.data
    })
    test('add a track to tagging queue without providing an audio file to get validation error', async () => {
      await expect(
        authenticatedTestClient.endpoints.track.tag({
          title: GENERIC_TRACK_RESPONSE.title,
          audio: fs.createReadStream(path.resolve('test/data/invalid.txt'))
        })
      ).rejects.toThrowError(AxiosError)
    })
  })

  describe('detail', () => {
    test('successfully show track details', async () => {
      let response: WrappedResponse<DetailResponse> = { data: {}, userData: {} }
      for (let attempt = 0; attempt < 10; attempt++) {
        response = await authenticatedTestClient.endpoints.track.detail({
          trackId: track.id as string
        })
        if (response.data.processedAt !== null) {
          track = response.data
          break
        }
        sleep(5)
      }
      expect(response).toEqual({
        data: expect.objectContaining({
          id: track.id,
          title: GENERIC_TRACK_RESPONSE.title,
          tags: {
            bpm: expect.toBeNumberOrNull(),
            key: expect.arrayContaining([expect.any(String)]),
            moods: expect.arrayContaining([expect.any(String)]),
            genres: expect.arrayContaining([expect.any(String)]),
            usages: expect.arrayContaining([expect.any(String)]),
            vocals: expect.arrayContaining([expect.any(String)]),
            decades: expect.arrayContaining([expect.any(String)]),
            tempo: expect.arrayContaining([expect.any(String)]),
            instruments: expect.arrayContaining([expect.any(String)])
          },
          filesize: expect.any(Number),
          duration: expect.any(Number),
          processedAt: expect.stringMatching(
            /\d{4}-\d{2}-\d{2}(T|\s+)\d{2}:\d{2}:\d{2}(\+\d{2}:\d{2})?(\.\d+)?([+-]\d{2}:\d{2})?/
          ),
          hookUrl: null,
          modelVersion: expect.any(String)
        }),
        userData: GENERIC_USER_DATA
      })
    })
    test('attempt to show details of a non-existing track to get an error', async () => {
      await expect(
        authenticatedTestClient.endpoints.track.detail({ trackId: '1234' })
      ).rejects.toThrowError(AxiosError)
    })
  })

  describe('length', () => {
    test('successfully get count of tracks', async () => {
      const response = await authenticatedTestClient.endpoints.track.length()
      expect(response).toEqual({
        data: expect.objectContaining({
          length: expect.any(Number)
        }),
        userData: GENERIC_USER_DATA
      })
    })
  })

  describe('list', () => {
    test('successfully list tracks', async () => {
      const response = await authenticatedTestClient.endpoints.track.list()
      expect(response).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            tags: expect.anything(),
            filesize: expect.anything(),
            duration: expect.anything(),
            processedAt: expect.anything(),
            modelVersion: expect.any(String)
          })
        ]),
        userData: GENERIC_USER_DATA
      })
    })
  })

  describe('add tag', () => {
    test('successfully add a tag to a track', async () => {
      const response = await authenticatedTestClient.endpoints.track.addTag({
        trackId: track.id as string,
        category: Categories.moods,
        value: 'malevolent'
      })
      expect(response).toEqual({
        data: expect.objectContaining({
          id: track.id,
          title: GENERIC_TRACK_RESPONSE.title,
          tags: {
            ...track.tags,
            moods: [...(track.tags?.moods as string[]), 'malevolent']
          },
          filesize: track.filesize,
          duration: track.duration,
          processedAt: track.processedAt,
          hookUrl: track.hookUrl,
          modelVersion: track.modelVersion
        }),
        userData: GENERIC_USER_DATA
      })
    })
    test('attempt to add a tag to a non-existing track to get an error', async () => {
      await expect(
        authenticatedTestClient.endpoints.track.addTag({
          trackId: '1234',
          category: Categories.moods,
          value: 'malevolent'
        })
      ).rejects.toThrowError(AxiosError)
    })
  })

  describe('remove tag', () => {
    test('successfully remove a tag from a track', async () => {
      const response = await authenticatedTestClient.endpoints.track.removeTag({
        trackId: track.id as string,
        category: Categories.moods,
        value: 'malevolent'
      })
      expect(response).toEqual({
        data: expect.objectContaining({ ...track }),
        userData: GENERIC_USER_DATA
      })
    })
    test('attempt to remove a tag from a non-existing track to get an error', async () => {
      await expect(
        authenticatedTestClient.endpoints.track.removeTag({
          trackId: '1234',
          category: Categories.moods,
          value: 'malevolent'
        })
      ).rejects.toThrowError(AxiosError)
    })
  })

  describe('delete', () => {
    test('successfully delete a track', async () => {
      const response = await authenticatedTestClient.endpoints.track.delete({
        trackId: track.id as string
      })
      expect(response).toEqual({
        data: expect.objectContaining({
          id: track.id,
          title: GENERIC_TRACK_RESPONSE.title
        }),
        userData: GENERIC_USER_DATA
      })
    })
    test('attempt to delete a non-existing track to get an error', async () => {
      await expect(
        authenticatedTestClient.endpoints.track.delete({ trackId: '1234' })
      ).rejects.toThrowError(AxiosError)
    })
  })
})
