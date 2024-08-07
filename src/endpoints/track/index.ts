import { AddTagEndpoint, addTag } from './addTag.js'
import { DeleteEndpoint, deleteTrack } from './delete.js'
import { DetailEndpoint, trackDetail } from './detail.js'
import { LengthEndpoint, trackLength } from './length.js'
import { ListEndpoint, trackList } from './list.js'
import { RemoveTagEndpoint, removeTag } from './removeTag.js'
import { TagEndpoint, trackTag } from './tag.js'

interface TrackEndpoints {
  addTag: AddTagEndpoint
  delete: DeleteEndpoint
  detail: DetailEndpoint
  length: LengthEndpoint
  list: ListEndpoint
  removeTag: RemoveTagEndpoint
  tag: TagEndpoint
}

export {
  TrackEndpoints,
  addTag,
  deleteTrack,
  trackDetail,
  trackLength,
  trackList,
  removeTag,
  trackTag
}
