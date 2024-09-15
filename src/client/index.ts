import {
  ApiUserToken,
  authenticate,
  register,
  registerConfirm,
  requestPasswordReset,
  resetPassword
} from '../endpoints/authentication/index.js'
import {
  addTag,
  deleteTrack,
  removeTag,
  trackDetail,
  trackLength,
  trackList,
  trackTag
} from '../endpoints/track/index.js'
import {
  addTrack,
  batchDetail,
  batchExport,
  batchLength,
  batchList,
  createBatch,
  deleteBatch,
  startTagging,
  updateBatch
} from '../endpoints/batch/index.js'
import {
  applyPromoCode,
  changePassword,
  createCategory,
  createTag,
  deleteCategory,
  deleteTag,
  getCategoryList,
  getTagList,
  getTaxonomyMapping,
  getTaxonomyPresets,
  remainingMonthlyRequests,
  stripeAccountData,
  subscriptionStatus,
  updateCategory,
  updateTag,
  updateTaxonomyMapping
} from '../endpoints/apiUser/index.js'
import axios, { AxiosInstance } from 'axios'
import { version as packageVersion } from '../../package.json'

import { Endpoints } from '../endpoints/index.js'
import { categoryList } from '../endpoints/category/list.js'
import { health } from '../endpoints/health/index.js'
import { taxonomyPresetList } from '../endpoints/taxonomyPreset/list.js'

const API_HOST = 'https://auto-tagging-api.aimsapi.com'

interface CredentialsOptions {
  clientId: string
  clientSecret: string
  apiHost?: string
  apiUserToken?: ApiUserToken
  userEmail?: string
  userPassword?: string
  ipAddr?: string
}

interface Credentials {
  configure: (options: CredentialsOptions) => void
  setApiUserToken: (token: ApiUserToken) => void
  refreshApiUserToken: () => Promise<void>
}

interface UserCredentials {
  userEmail: string | null
  userPassword: string | null
  apiUserToken: ApiUserToken | null
}

interface CredentialStore extends UserCredentials {
  clientId: string | null
  clientSecret: string | null
  apiHost: string
  ipAddr?: string | undefined
}

interface InternalConfiguration {
  credentials: CredentialStore
}

class Client {
  private client: AxiosInstance | null = null

  private readonly internal: InternalConfiguration = {
    credentials: {
      clientId: null,
      clientSecret: null,
      userEmail: null,
      userPassword: null,
      apiUserToken: null,
      apiHost: API_HOST,
      ipAddr: undefined
    }
  }

  private readonly configure = (options: CredentialsOptions): void => {
    this.internal.credentials.clientId = options.clientId
    this.internal.credentials.clientSecret = options.clientSecret
    this.internal.credentials.userEmail = options.userEmail ?? null
    this.internal.credentials.userPassword = options.userEmail ?? null
    this.internal.credentials.apiUserToken = options.apiUserToken ?? null
    this.internal.credentials.ipAddr = options.ipAddr ?? undefined
    this.refreshClient()
  }

  private readonly setApiUserToken = (token: ApiUserToken): void => {
    this.internal.credentials.apiUserToken = token
    this.refreshClient()
  }

  private readonly refreshApiUserToken = async (): Promise<void> => {
    const { userEmail, userPassword } = this.internal.credentials
    if (userEmail === null || userPassword === null) {
      throw new Error(
        'can not refresh api user token - no email and/or password'
      )
    }
    const { token } = await this.endpoints.authentication.authenticate({
      userEmail,
      userPassword
    })
    this.setApiUserToken(token)
  }

  readonly credentials: Credentials = {
    configure: this.configure,
    setApiUserToken: this.setApiUserToken,
    refreshApiUserToken: this.refreshApiUserToken
  }

  private readonly refreshClient = (): void => {
    const { clientId, clientSecret, apiUserToken, apiHost, ipAddr } = this.internal.credentials
    this.client = axios.create({
      baseURL: apiHost,
      headers: {
        'X-Client-Id': clientId,
        'X-Client-Secret': clientSecret,
        'X-Api-User-Token': apiUserToken?.token ?? undefined,
        'X-Forwarded-For': ipAddr,
        'User-Agent': `aims-tagging-node/${packageVersion}`
      }
    })
  }

  private readonly getClient = (): AxiosInstance => {
    if (this.client === null) {
      this.refreshClient()
    }
    return this.client as AxiosInstance
  }

  private readonly authenticateCallback = ({
    userEmail,
    userPassword,
    apiUserToken
  }: UserCredentials): void => {
    this.internal.credentials.userEmail = userEmail
    this.internal.credentials.userPassword = userPassword
    this.internal.credentials.apiUserToken = apiUserToken
    this.refreshClient()
  }

  readonly endpoints: Endpoints = {
    apiUser: {
      remainingMonthlyRequests: remainingMonthlyRequests(this.getClient),
      changePassword: changePassword(this.getClient),
      subscriptionStatus: subscriptionStatus(this.getClient),
      stripeAccountData: stripeAccountData(this.getClient),
      applyPromoCode: applyPromoCode(this.getClient),
      getTaxonomyMapping: getTaxonomyMapping(this.getClient),
      updateTaxonomyMapping: updateTaxonomyMapping(this.getClient),
      getTaxonomyPresets: getTaxonomyPresets(this.getClient),
      createCategory: createCategory(this.getClient),
      createTag: createTag(this.getClient),
      deleteCategory: deleteCategory(this.getClient),
      deleteTag: deleteTag(this.getClient),
      getCategoryList: getCategoryList(this.getClient),
      getTagList: getTagList(this.getClient),
      updateCategory: updateCategory(this.getClient),
      updateTag: updateTag(this.getClient)
    },
    authentication: {
      authenticate: authenticate(this.getClient, this.authenticateCallback),
      register: register(this.getClient),
      registerConfirm: registerConfirm(this.getClient),
      requestPasswordReset: requestPasswordReset(this.getClient),
      resetPassword: resetPassword(this.getClient)
    },
    batch: {
      addTrack: addTrack(this.getClient),
      create: createBatch(this.getClient),
      delete: deleteBatch(this.getClient),
      detail: batchDetail(this.getClient),
      export: batchExport(this.getClient),
      length: batchLength(this.getClient),
      list: batchList(this.getClient),
      startTagging: startTagging(this.getClient),
      update: updateBatch(this.getClient)
    },
    health: {
      health: health(this.getClient)
    },
    track: {
      addTag: addTag(this.getClient),
      delete: deleteTrack(this.getClient),
      detail: trackDetail(this.getClient),
      length: trackLength(this.getClient),
      list: trackList(this.getClient),
      removeTag: removeTag(this.getClient),
      tag: trackTag(this.getClient)
    },
    category: {
      list: categoryList(this.getClient)
    },
    taxonomyPreset: {
      list: taxonomyPresetList(this.getClient)
    }
  }

  constructor (options?: CredentialsOptions) {
    this.internal = {
      credentials: {
        clientId: options?.clientId ?? null,
        clientSecret: options?.clientSecret ?? null,
        userEmail: options?.userEmail ?? null,
        userPassword: options?.userPassword ?? null,
        apiUserToken: options?.apiUserToken ?? null,
        apiHost: options?.apiHost ?? API_HOST,
        ipAddr: options?.ipAddr ?? undefined
      }
    }
  }
}

export { Client, InternalConfiguration, API_HOST, UserCredentials }
