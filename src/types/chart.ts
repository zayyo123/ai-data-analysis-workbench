export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'metric'

export type AggregateMethod = 'sum' | 'avg' | 'count' | 'max' | 'min'

export interface ChartConfig {
  id: string
  type: ChartType
  title: string
  xField?: string
  yField?: string
  categoryField?: string
  aggregate: AggregateMethod
  topN?: number
  sort?: 'asc' | 'desc' | 'none'
}

export interface ChartRecommendation {
  id: string
  config: ChartConfig
  reason: string
  score: number
}

export interface DashboardConfig {
  title: string
  description: string
  charts: DashboardChart[]
  filters: FilterCondition[]
}

export interface DashboardChart {
  id: string
  config: ChartConfig
  layout: {
    x: number
    y: number
    w: number
    h: number
  }
}

export interface FilterCondition {
  field: string
  operator: 'eq' | 'in' | 'range' | 'contains'
  value: unknown
}
