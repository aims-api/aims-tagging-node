import { ApplyPromoCodeEndpoint, applyPromoCode } from './applyPromoCode.js'
import { ChangePasswordEndpoint, changePassword } from './changePassword.js'
import {
  RemainingMonthlyRequestsEndpoint,
  remainingMonthlyRequests
} from './remainingMonthlyRequests.js'
import {
  StripeAccountDataEndpoint,
  stripeAccountData
} from './stripeAccountData.js'
import {
  SubscriptionStatusEndpoint,
  subscriptionStatus
} from './subscriptionStatus.js'
import {
  GetTaxonomyMappingEndpoint,
  getTaxonomyMapping
} from './customTaxonomy/getTaxonomyMapping.js'
import {
  UpdateTaxonomyMappingEndpoint,
  updateTaxonomyMapping
} from './customTaxonomy/updateTaxonomyMapping.js'
import { getTaxonomyPresets, GetTaxonomyPresetsEndpoint } from './getTaxonomyPresets.js'
import { createCategory, CreateCategoryEndpoint } from './customTaxonomy/createCategory.js'
import { createTag, CreateTagEndpoint } from './customTaxonomy/createTag.js'
import { getCategoryList, GetCategoryListEndpoint } from './customTaxonomy/getCategoryList.js'
import { getTagList, GetTagListEndpoint } from './customTaxonomy/getTagList.js'
import { updateCategory, UpdateCategoryEndpoint } from './customTaxonomy/updateCategory.js'
import { updateTag, UpdateTagEndpoint } from './customTaxonomy/updateTag.js'
import { deleteTag, DeleteTagEndpoint } from './customTaxonomy/deleteTag.js'
import { deleteCategory, DeleteCategoryEndpoint } from './customTaxonomy/deleteCategory.js'
interface ApiUserEndpoints {
  remainingMonthlyRequests: RemainingMonthlyRequestsEndpoint
  changePassword: ChangePasswordEndpoint
  subscriptionStatus: SubscriptionStatusEndpoint
  stripeAccountData: StripeAccountDataEndpoint
  applyPromoCode: ApplyPromoCodeEndpoint
  getTaxonomyMapping: GetTaxonomyMappingEndpoint
  updateTaxonomyMapping: UpdateTaxonomyMappingEndpoint
  getTaxonomyPresets: GetTaxonomyPresetsEndpoint
  createCategory: CreateCategoryEndpoint
  createTag: CreateTagEndpoint
  deleteCategory: DeleteCategoryEndpoint
  deleteTag: DeleteTagEndpoint
  getCategoryList: GetCategoryListEndpoint
  getTagList: GetTagListEndpoint
  updateCategory: UpdateCategoryEndpoint
  updateTag: UpdateTagEndpoint
}

export {
  ApiUserEndpoints,
  remainingMonthlyRequests,
  changePassword,
  subscriptionStatus,
  stripeAccountData,
  applyPromoCode,
  getTaxonomyMapping,
  updateTaxonomyMapping,
  getTaxonomyPresets,
  createCategory,
  createTag,
  deleteCategory,
  deleteTag,
  getCategoryList,
  getTagList,
  updateCategory,
  updateTag
}
