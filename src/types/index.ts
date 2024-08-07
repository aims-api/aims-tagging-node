type Batch = Partial<{
  id: string
  name: string
  taggingStartedAt: DateTime | null
  taggingCompletedAt: DateTime | null
  lastExportedAt: DateTime | null
  lastExtendedAt: DateTime | null
  lastTagChangedAt: DateTime | null
  tracks: Track[]
}>

type Track = Partial<{
  id: string
  title: string
  tags: Tags | null
  filesize: number | null
  duration: number | null
  processedAt: DateTime | null
  hookUrl: string | null
  modelVersion: string
  queuedAt: DateTime | null
  batchId: string | null
}>

type Date = `${number}-${number}-${number}`
type Time = `${number}:${number}:${number}`
type TimeZone = `${'+' | '-'}${number}:${number}`

type DateTime = `${Date}T${Time}${TimeZone}`

enum Categories {
  key = 'key',
  moods = 'moods',
  genres = 'genres',
  usages = 'usages',
  vocals = 'vocals',
  decades = 'decades',
  instruments = 'instruments',
  tempo = 'tempo'
}

type Tags = {
  bpm: number | null
} & Partial<{
  [key in Categories]: string[]
}> & Partial<{
  [customName: string]: string[]
}>

interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

type SortOptions = SortOption[]

interface ListRequestParameters {
  limit?: number
  orderBy?: SortOptions
}

interface ResponseStructure {
  [key: string]: boolean | ResponseStructure
}

interface ResponseStructureRequestParameters {
  responseStructure?: ResponseStructure
}

type LogicalOperator = 'and' | 'or'

type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'gten'
  | 'lt'
  | 'lte'
  | 'begins'
  | 'contains'
  | 'not-contains'
  | 'ends'
  | 'null'
  | 'not-null'
  | 'empty'
  | 'not-empty'
  | 'in'

interface FilterItem {
  field: string
  operator: FilterOperator
  value: any
}

interface Filter {
  logic?: LogicalOperator
  conditions: Array<FilterItem | Filter>
}

interface FilterRequestParameters {
  filter?: Filter
}

type FeatureFlags = Partial<{
  [feature: string]: boolean
}>

interface SubscriptionStatus {
  trialExpiresAt: DateTime | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripeProductId: string | null
  subscriptionCreditsPerMonth: number | null
  subscriptionStatus: 'active' | 'suspended' | null
  previousSubscriptionPaymentAt: DateTime | null
  features: FeatureFlags | null
}

interface Mapping {
  categories: Record<string, { title: string, enabled: boolean }>
  tags: Array<{
    mode: string
    enabled: boolean
    source: string[] | string
    destination?: Array<{
      category: string
      title: string
    }> | {
      category: string
      title: string
    }
  }>
}

interface TaxonomyMappingPreset {
  id: string
  name: string
  premium: boolean
  mapping: Mapping
}

interface CustomTag {
  id: string
  createdAt: DateTime
  value: string
  enabled: boolean
  category: {
    id: string
  } | null
  apiUserCategory: {
    id: string
  } | null
}

export {
  Batch,
  Categories,
  DateTime,
  Filter,
  FilterItem,
  FilterOperator,
  FilterRequestParameters,
  ListRequestParameters,
  LogicalOperator,
  Mapping,
  TaxonomyMappingPreset,
  CustomTag,
  ResponseStructure,
  ResponseStructureRequestParameters,
  SortOption,
  SortOptions,
  Track,
  Tags,
  SubscriptionStatus
}
