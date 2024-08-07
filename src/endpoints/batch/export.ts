import { AxiosInstance } from 'axios'
type ExportEndpoint = (request: ExportRequest) => Promise<ExportResponse>

interface ExportRequest {
  batchId: string
  fileFormat?: 'csv' | 'excel'
  dataFormat?: 'default' | 'source_audio' | 'harvest' | 'disco' | 'cadenzabox'
}

type ExportResponse = string

const batchExport =
  (client: () => AxiosInstance): ExportEndpoint =>
    async (request: ExportRequest): Promise<ExportResponse> => {
      const { batchId, fileFormat = 'csv', dataFormat = 'default' } = request

      const response = await client().get(
      `/batch/export/${batchId}?file_format=${fileFormat}&data_format=${dataFormat}`,
      {
        responseType: fileFormat === 'excel' ? 'stream' : undefined
      }
      )
      return response.data as ExportResponse
    }

export { ExportEndpoint, batchExport }
