import type { AiStreamClient } from '@/types/ai'

export class MockAiClient implements AiStreamClient {
  async *generateAnalysisStream(_prompt: string, signal?: AbortSignal): AsyncGenerator<string> {
    const chunks = [
      '## 数据概览\n\n',
      '当前数据集已经完成字段识别和图表建模，可以从趋势、结构和异常三个角度继续分析。\n\n',
      '## 核心发现\n\n',
      '1. 数值字段适合观察总量、均值和极值变化。\n',
      '2. 分类字段适合定位不同地区、品类或渠道之间的表现差异。\n',
      '3. 日期字段适合识别时间趋势和周期性波动。\n\n',
      '## 业务建议\n\n',
      '建议优先关注贡献最高的分类维度，并结合趋势图判断是否存在短期异常波动。对于空值较多的字段，应在正式分析前补充数据质量说明。\n',
    ]

    for (const chunk of chunks) {
      if (signal?.aborted) return
      await new Promise((resolve) => window.setTimeout(resolve, 180))
      yield chunk
    }
  }
}
