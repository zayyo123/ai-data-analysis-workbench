import type { ChartRecommendation } from '@/types/chart'
import type { FieldSchema } from '@/types/dataset'
import { createId } from '@/utils/id'

/**
 * 根据字段类型生成图表推荐。
 * 第一版使用明确规则，保证推荐结果可解释，后续可以扩展为权重打分模型。
 */
export function recommendCharts(fields: FieldSchema[]): ChartRecommendation[] {
  const categories = fields.filter((field) => field.type === 'category')
  const numbers = fields.filter((field) => field.type === 'number')
  const dates = fields.filter((field) => field.type === 'date')
  const recommendations: ChartRecommendation[] = []

  categories.forEach((categoryField) => {
    numbers.forEach((numberField) => {
      recommendations.push({
        id: createId('recommendation'),
        score: 90,
        reason: `${categoryField.name} 是分类字段，${numberField.name} 是数值字段，适合对比不同分类下的数值差异。`,
        config: {
          id: createId('chart'),
          type: 'bar',
          title: `${categoryField.name}${numberField.name}对比`,
          xField: categoryField.name,
          yField: numberField.name,
          aggregate: 'sum',
          topN: 10,
          sort: 'desc',
        },
      })

      recommendations.push({
        id: createId('recommendation'),
        score: 76,
        reason: `${categoryField.name} 的分类数量适合查看占比结构。`,
        config: {
          id: createId('chart'),
          type: 'pie',
          title: `${categoryField.name}${numberField.name}占比`,
          xField: categoryField.name,
          yField: numberField.name,
          aggregate: 'sum',
          topN: 8,
          sort: 'desc',
        },
      })
    })
  })

  dates.forEach((dateField) => {
    numbers.forEach((numberField) => {
      recommendations.push({
        id: createId('recommendation'),
        score: 95,
        reason: `${dateField.name} 是日期字段，适合观察 ${numberField.name} 的时间趋势。`,
        config: {
          id: createId('chart'),
          type: 'line',
          title: `${numberField.name}趋势`,
          xField: dateField.name,
          yField: numberField.name,
          aggregate: 'sum',
          sort: 'asc',
        },
      })
    })
  })

  numbers.forEach((numberField) => {
    recommendations.push({
      id: createId('recommendation'),
      score: 70,
      reason: `${numberField.name} 是核心数值字段，适合作为指标卡展示总量。`,
      config: {
        id: createId('chart'),
        type: 'metric',
        title: `${numberField.name}总计`,
        xField: numberField.name,
        yField: numberField.name,
        aggregate: 'sum',
        sort: 'none',
      },
    })
  })

  return recommendations.sort((a, b) => b.score - a.score).slice(0, 12)
}
