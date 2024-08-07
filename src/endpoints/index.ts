import { ApiUserEndpoints } from './apiUser/index.js'
import { AuthenticationEndpoints } from './authentication/index.js'
import { BatchEndpoints } from './batch/index.js'
import { CategoryEndpoints } from './category/index.js'
import { HealthEndpoints } from './health/index.js'
import { TaxonomyPresetEndpoints } from './taxonomyPreset/index.js'
import { TrackEndpoints } from './track/index.js'

interface Endpoints {
  health: HealthEndpoints
  authentication: AuthenticationEndpoints
  apiUser: ApiUserEndpoints
  batch: BatchEndpoints
  track: TrackEndpoints
  category: CategoryEndpoints
  taxonomyPreset: TaxonomyPresetEndpoints
}

export { Endpoints }
