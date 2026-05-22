import type { EChartsOption } from 'echarts'
import type { ChartConfig } from '@/types/chart'
import type { AggregateResultItem } from './aggregate'

/**
 * 根据统一图表配置生成 ECharts option。
 * 组件层只负责渲染，避免把不同图表类型的细节散落到多个组件中。
 */
export function buildChartOption(config: ChartConfig, data: AggregateResultItem[]): EChartsOption {
  if (config.type === 'pie') {
    return {
      title: { text: config.title, left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'item' },
      series: [{ type: 'pie', radius: ['35%', '65%'], data }],
    }
  }

  if (config.type === 'metric') {
    return {
      title: { text: config.title, left: 'center', textStyle: { fontSize: 14 } },
      graphic: {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: String(data.reduce((sum, item) => sum + item.value, 0)),
          fontSize: 34,
          fontWeight: 700,
          fill: '#1f2937',
        },
      },
    }
  }

  return {
    title: { text: config.title, textStyle: { fontSize: 14 } },
    grid: { left: 42, right: 18, top: 52, bottom: 36 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.map((item) => item.name), axisLabel: { interval: 0, rotate: data.length > 6 ? 24 : 0 } },
    yAxis: { type: 'value' },
    series: [
      {
        type: config.type === 'area' ? 'line' : config.type === 'scatter' ? 'scatter' : config.type,
        data: data.map((item) => item.value),
        areaStyle: config.type === 'area' ? {} : undefined,
        smooth: config.type === 'line' || config.type === 'area',
      },
    ],
  }
}
