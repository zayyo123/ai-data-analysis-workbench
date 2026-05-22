export interface AiStreamClient {
  generateAnalysisStream(prompt: string, signal?: AbortSignal): AsyncGenerator<string>
}
