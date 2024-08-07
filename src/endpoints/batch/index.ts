import { AddTrackEndpoint, addTrack } from './addTrack.js'
import { CreateEndpoint, createBatch } from './create.js'
import { DeleteEndpoint, deleteBatch } from './delete.js'
import { DetailEndpoint, batchDetail } from './detail.js'
import { ExportEndpoint, batchExport } from './export.js'
import { LengthEndpoint, batchLength } from './length.js'
import { ListEndpoint, batchList } from './list.js'
import { StartTaggingEndpoint, startTagging } from './startTagging.js'
import { UpdateEndpoint, updateBatch } from './update.js'

interface BatchEndpoints {
  addTrack: AddTrackEndpoint
  create: CreateEndpoint
  delete: DeleteEndpoint
  detail: DetailEndpoint
  export: ExportEndpoint
  length: LengthEndpoint
  list: ListEndpoint
  startTagging: StartTaggingEndpoint
  update: UpdateEndpoint
}

export {
  BatchEndpoints,
  addTrack,
  createBatch,
  deleteBatch,
  batchDetail,
  batchExport,
  batchLength,
  batchList,
  startTagging,
  updateBatch
}
