import {
  GENERIC_BATCH_CSV,
  GENERIC_BATCH_RESPONSE,
  GENERIC_TRACK_RESPONSE,
  GENERIC_USER_DATA
} from '../../mocks/handlers.js'
import { describe, expect, test } from '@jest/globals'

import { AxiosError } from 'axios'
import { authenticatedTestClient } from '../../client'
import fs from 'fs'
import path from 'path'

describe('batch', () => {
  let batchId: string

  describe('create', () => {
    test('successfully create a batch', async () => {
      const response = await authenticatedTestClient.endpoints.batch.create({
        name: 'Temporary name'
      })
      expect(response).toEqual(
        expect.objectContaining({
          data: {
            id: expect.any(String),
            name: 'Temporary name'
          },
          userData: GENERIC_USER_DATA
        })
      )
      batchId = response.data.id as string
    })
  })

  describe('update', () => {
    test('successfully update a batch', async () => {
      const response = await authenticatedTestClient.endpoints.batch.update({
        batchId,
        name: GENERIC_BATCH_RESPONSE.name
      })
      expect(response).toEqual(
        expect.objectContaining({
          data: {
            id: batchId,
            name: GENERIC_BATCH_RESPONSE.name
          },
          userData: GENERIC_USER_DATA
        })
      )
    })
    test('attempt to update a non-existing batch to get an error', async () => {
      await expect(
        authenticatedTestClient.endpoints.batch.update({
          batchId: '1234',
          name: 'not going to work anyway'
        })
      ).rejects.toThrowError(AxiosError)
    })
  })

  describe('detail', () => {
    test('successfully show batch details', async () => {
      const response = await authenticatedTestClient.endpoints.batch.detail({
        batchId
      })
      expect(response).toEqual(
        expect.objectContaining({
          data: { id: batchId, name: GENERIC_BATCH_RESPONSE.name },
          userData: GENERIC_USER_DATA
        })
      )
    })
    test('attempt to show details of a non-existing batch to get an error', async () => {
      await expect(
        authenticatedTestClient.endpoints.batch.detail({ batchId: '1234' })
      ).rejects.toThrowError(AxiosError)
    })
  })

  describe('export', () => {
    test('successfully export batch', async () => {
      const response = await authenticatedTestClient.endpoints.batch.export({
        batchId
      })
      expect(response).toEqual(GENERIC_BATCH_CSV)
    })
    test('attempt to export a non-existing batch to get an error', async () => {
      await expect(
        authenticatedTestClient.endpoints.batch.export({ batchId: '1234' })
      ).rejects.toThrowError(AxiosError)
    })
  })

  describe('length', () => {
    test('successfully get count of batches', async () => {
      const response = await authenticatedTestClient.endpoints.batch.length()
      expect(response).toEqual({
        data: expect.objectContaining({
          length: expect.any(Number)
        }),
        userData: GENERIC_USER_DATA
      })
    })
  })

  describe('list', () => {
    test('successfully list batches', async () => {
      const response = await authenticatedTestClient.endpoints.batch.list()
      expect(response).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining([
            { id: expect.any(String), name: expect.any(String) }
          ]),
          userData: GENERIC_USER_DATA
        })
      )
    })
  })

  describe('add track', () => {
    test('successfully add a track to batch', async () => {
      const response = await authenticatedTestClient.endpoints.batch.addTrack({
        batchId,
        audio: fs.createReadStream(path.resolve('test/data/sample.mp3'))
      })
      expect(response).toEqual({
        data: expect.objectContaining({
          id: GENERIC_TRACK_RESPONSE.id,
          title: GENERIC_TRACK_RESPONSE.title
        }),
        userData: GENERIC_USER_DATA
      })
    })
    test('add a track to a batch without providing an audio file to get validation error', async () => {
      await expect(
        authenticatedTestClient.endpoints.batch.addTrack({
          batchId,
          audio: fs.createReadStream(path.resolve('test/data/invalid.txt'))
        })
      ).rejects.toThrowError(AxiosError)
    })
  })

  describe('start tagging', () => {
    test('successfully start tagging of a batch', async () => {
      const response = await authenticatedTestClient.endpoints.batch.startTagging(
        { batchId }
      )
      expect(response).toEqual(
        expect.objectContaining({
          data: {
            id: batchId,
            name: GENERIC_BATCH_RESPONSE.name
          },
          userData: GENERIC_USER_DATA
        })
      )
    })
    test('attempt to start tagging of a non-existing batch to get an error', async () => {
      await expect(
        authenticatedTestClient.endpoints.batch.startTagging({
          batchId: '1234'
        })
      ).rejects.toThrowError(AxiosError)
    })
  })

  describe('delete', () => {
    test('successfully delete a batch', async () => {
      const response = await authenticatedTestClient.endpoints.batch.delete({
        batchId
      })
      expect(response).toEqual({
        data: expect.objectContaining({
          id: batchId,
          name: GENERIC_BATCH_RESPONSE.name
        }),
        userData: GENERIC_USER_DATA
      })
    })
    test('attempt to delete a non-existing batch to get an error', async () => {
      await expect(
        authenticatedTestClient.endpoints.batch.delete({ batchId: '1234' })
      ).rejects.toThrowError(AxiosError)
    })
  })
})
