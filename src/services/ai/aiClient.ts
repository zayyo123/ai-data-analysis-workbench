import type { AiStreamClient } from '@/types/ai'
import { MockAiClient } from './mockAiClient'

export function createAiClient(): AiStreamClient {
  const enableMock = import.meta.env.VITE_ENABLE_MOCK_AI !== 'false'
  if (enableMock) return new MockAiClient()

  return {
    async *generateAnalysisStream(prompt: string, signal?: AbortSignal): AsyncGenerator<string> {
      const baseUrl = import.meta.env.VITE_AI_API_BASE_URL
      const apiKey = import.meta.env.VITE_AI_API_KEY
      if (!baseUrl || !apiKey) {
        yield* new MockAiClient().generateAnalysisStream(prompt, signal)
        return
      }

      const response = await fetch(`${baseUrl}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ prompt }),
        signal,
      })

      if (!response.ok || !response.body) {
        throw new Error('AI 服务请求失败')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        yield decoder.decode(value, { stream: true })
      }
    },
  }
}
