# AI Data Analysis Workbench

一个面向真实数据分析场景的全栈 AI 数据分析工作台。项目支持 CSV / Excel 上传解析、字段建模、数据预览、图表推荐、Dashboard 编辑、AI 分析、报告导出、账号登录、云端项目保存、用量限制和本地模式兜底。

本仓库的目标是做成一个可以开源、可以部署、可以面试讲解、也可以继续扩展的完整商业化 MVP，而不是一次性演示页面。

## 当前全栈 MVP

当前版本已经具备一条可演示的前后端闭环：

1. 未登录用户可以直接上传示例数据，在浏览器本地完成分析、图表和 Markdown 报告导出。
2. 注册 / 登录后，前端会接入 Fastify 后端，把数据集摘要、项目、Dashboard 和 AI 报告保存到 SQLite。
3. 后端提供 JWT 鉴权、用户信息、数据集、项目、AI 分析报告和用量限制接口。
4. 免费套餐默认每天 5 次 AI 分析；无真实 AI Key 时走 Mock AI，保证开源项目可直接演示。
5. 已配置前后端 CI、Vitest 单元测试、Fastify API 集成测试和 Playwright E2E。

## 项目定位

AI Data Analysis Workbench 是一个运行在浏览器端的数据分析应用。用户上传业务数据后，系统会自动完成字段识别、数据质量分析、图表推荐和 Dashboard 生成，并可以调用 AI 输出分析摘要、异常洞察、业务建议和报告内容。

项目重点展示：

- 前端解析 CSV / Excel 大文件的能力。
- TypeScript 数据模型设计能力。
- 复杂状态管理能力。
- ECharts 可视化封装能力。
- Web Worker 性能优化能力。
- AI 流式输出和上下文压缩能力。
- 报告导出和工程化交付能力。

## 在线演示

> 当前仓库还处于规划阶段，完成部署后在这里补充线上地址。

- Preview: `https://your-demo-domain.com`
- Docs: `https://your-demo-domain.com/docs`

## 功能总览

### 当前已实现

- 首页支持上传本地 CSV / Excel 文件。
- 首页支持一键加载内置示例数据，无需手动选择文件即可体验完整流程。
- 支持注册、登录、JWT 会话恢复和用户信息读取。
- 登录后支持云端保存数据集摘要、项目 Dashboard、AI 报告和用量记录。
- 工作台支持从远程项目恢复 Dashboard、字段和数据样本快照。
- 首页和工作台支持套餐与 AI 用量展示。
- 套餐卡支持 Mock 升级到 Pro / Team，演示免费额度耗尽后的商业化转化路径。
- AI 面板支持读取已保存报告并载入历史结论。
- 工作台支持字段识别、字段统计和字段类型手动修正。
- 工作台支持前 100 行数据预览、关键词搜索和空值高亮。
- 工作台支持按字段类型自动推荐图表，并一键添加到 Dashboard。
- Dashboard 支持图表展示、删除、点击筛选和选中态。
- 右侧图表配置面板支持编辑图表标题、图表类型、维度字段、数值字段、聚合方式、Top N 和排序。
- AI 分析面板支持 Mock 流式输出、停止生成、清空和保存到报告。
- 报告页支持 Markdown 结构化预览和 Markdown 文件导出。
- 已补齐 Vitest 单元测试、Playwright E2E、GitHub Actions、示例数据和开源文档。

### 已规划核心功能

- CSV 文件上传、校验、解析。
- Excel 文件上传、多 Sheet 选择、解析。
- 字段类型自动识别。
- 字段统计和数据质量分析。
- 大数据量表格预览。
- 虚拟滚动表格。
- 柱状图、折线图、饼图、散点图、面积图、指标卡。
- 根据字段类型自动推荐图表。
- Dashboard 图表添加、删除、编辑、排序、调整大小。
- 多图表联动筛选。
- AI 分析摘要、趋势分析、异常洞察、经营建议。
- AI 流式输出、停止生成、重新生成。
- Markdown / HTML / PDF 报告导出。
- 本地项目保存、恢复、导入、导出。
- 示例数据集和完整使用说明。

### MVP 必须完成

第一版必须先完成下面闭环：

1. 用户上传 CSV。
2. 系统解析出字段和数据。
3. 系统识别字段类型。
4. 用户可以预览表格。
5. 用户可以生成图表。
6. 系统可以推荐图表。
7. 用户可以把图表加入 Dashboard。
8. 系统可以生成 Mock AI 分析。
9. 用户可以导出 Markdown 报告。

只要这 9 步完整跑通，项目就已经具备展示价值。

## 技术栈

### 前端框架

- Vue 3：组件化开发。
- TypeScript：类型约束和复杂数据结构建模。
- Vite：开发服务和生产构建。
- Vue Router：路由管理。
- Pinia：全局状态管理。
- Element Plus：基础 UI 组件。
- ECharts：图表渲染。

### 数据处理

- PapaParse：CSV 解析。
- xlsx：Excel 解析。
- Web Worker：大文件解析、字段统计、聚合计算。
- IndexedDB：保存数据集和项目快照。
- localStorage：保存轻量配置。

### AI 和导出

- fetch stream：AI 流式响应。
- SSE：可选的服务端事件流方案。
- Markdown：报告内容格式。
- html2canvas：图表和报告截图。
- jsPDF：PDF 导出。
- FileSaver：本地文件导出。

### 工程质量

- ESLint：静态检查。
- Prettier：代码格式化。
- Vitest：单元测试。
- Playwright：端到端测试。
- GitHub Actions：持续集成。
- Vercel / Netlify：线上部署。

## 快速开始

### 环境要求

- Node.js >= 20
- npm >= 10
- Git >= 2.40

### 只体验前端本地模式

本地模式不需要后端服务，适合快速演示上传、图表推荐、Dashboard、Mock AI 和 Markdown 导出。

```bash
npm install
npm run dev -- --port 5174
```

访问：

```text
http://127.0.0.1:5174
```

打开首页后可以选择两种方式体验：

- 点击上传区选择 `examples/sales.csv` 或自己的 CSV / Excel 文件。
- 点击首页“示例数据”中的“销售经营分析”或“用户增长分析”，直接进入工作台。

### 启动完整全栈模式

全栈模式会启用注册登录、云端项目保存、AI 报告记录和用量限制。

1. 安装前端依赖：

```bash
npm install
```

2. 安装后端依赖：

```bash
cd server
npm install
```

3. 准备后端环境变量：

```bash
copy .env.example .env
```

在 macOS / Linux 下使用：

```bash
cp .env.example .env
```

4. 初始化 Prisma Client 和数据库：

```bash
npm run prisma:generate
npm run prisma:migrate
```

如果你在 Windows 中文路径下遇到 Prisma schema engine 空错误，建议临时把仓库 clone 到纯英文路径，或先使用后端测试里的 SQL 建表策略继续开发。该问题已记录在 `docs/automation-notes.md`。

5. 启动后端：

```bash
npm run dev
```

后端默认运行在：

```text
http://127.0.0.1:4000
```

6. 新开一个终端启动前端：

```bash
npm run dev -- --port 5174
```

前端默认请求：

```text
VITE_API_BASE_URL=http://127.0.0.1:4000/api
```

### Docker Compose 演示部署

如果本机已安装 Docker，可以一条命令启动前后端：

```bash
docker compose up --build
```

访问：

```text
http://127.0.0.1:8080
```

该模式会用 Nginx 托管前端，并把 `/api` 反向代理到后端容器。SQLite 数据保存在 Docker volume `backend-data` 中。

### 旧项目初始化参考

如果当前目录还没有 Vite 工程，执行：

```bash
npm create vite@latest . -- --template vue-ts
npm install
```

安装核心依赖：

```bash
npm install vue-router pinia element-plus echarts papaparse xlsx idb file-saver
npm install markdown-it html2canvas jspdf
```

安装开发依赖：

```bash
npm install -D eslint prettier vitest @vue/test-utils jsdom playwright
npm install -D @types/papaparse @types/file-saver
```

生产构建：

```bash
npm run build
```

运行测试：

```bash
npm run test
```

端到端测试：

```bash
npm run e2e
```

## 推荐 package.json 脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.ts,.tsx --fix",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "typecheck": "vue-tsc --noEmit"
  }
}
```

## 环境变量

项目必须支持无 API Key 的 Mock 模式，保证开源仓库可以直接运行。

前端 `.env.example`：

```bash
# AI 服务地址。没有真实服务时可以留空，应用会自动走 Mock 模式。
VITE_AI_API_BASE_URL=

# AI API Key。不要提交真实 Key。
VITE_AI_API_KEY=

# 是否启用 Mock AI。true 表示使用前端内置模拟流式输出。
VITE_ENABLE_MOCK_AI=true

# 后端 API 地址。未启动后端时，前端仍可使用本地模式兜底。
VITE_API_BASE_URL=http://127.0.0.1:4000/api
```

创建 `.env.local`：

```bash
VITE_AI_API_BASE_URL=https://your-api-domain.com
VITE_AI_API_KEY=your_api_key
VITE_ENABLE_MOCK_AI=false
```

后端 `server/.env.example`：

```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=4000
CORS_ORIGIN="http://127.0.0.1:5174,http://localhost:5174"
AI_API_BASE_URL=""
AI_API_KEY=""
ENABLE_MOCK_AI=true
```

## 项目目录结构

正式实现时按下面结构创建文件。目录要稳定，后续扩展不要随意把业务逻辑写进组件里。

```text
src/
  app/
    pinia.ts
    router.ts
  assets/
    styles/
      base.css
      layout.css
      theme.css
  components/
    common/
      EmptyState.vue
      ErrorState.vue
      LoadingState.vue
      PageHeader.vue
    upload/
      FileDropzone.vue
      SheetSelector.vue
      UploadProgress.vue
    data-table/
      DataPreviewTable.vue
      FieldListPanel.vue
      FieldStatsCard.vue
    chart/
      ChartRenderer.vue
      ChartConfigPanel.vue
      ChartRecommendationList.vue
      MetricCard.vue
    dashboard/
      DashboardCanvas.vue
      DashboardChartCard.vue
      DashboardToolbar.vue
      FilterBar.vue
    ai/
      AiAnalysisPanel.vue
      AiMessageStream.vue
      AiPromptSelector.vue
    report/
      ReportPreview.vue
      ReportToolbar.vue
  composables/
    useDataset.ts
    useFieldStats.ts
    useChartData.ts
    useDashboard.ts
    useAiAnalysis.ts
    useReportExport.ts
  services/
    ai/
      aiClient.ts
      mockAiClient.ts
      promptBuilder.ts
      streamReader.ts
    chart/
      aggregate.ts
      optionBuilder.ts
      recommendCharts.ts
    parser/
      csvParser.ts
      excelParser.ts
      normalizeRows.ts
    report/
      exportHtml.ts
      exportMarkdown.ts
      exportPdf.ts
      reportBuilder.ts
    storage/
      indexedDb.ts
      projectStorage.ts
    worker/
      createWorkerTask.ts
  stores/
    aiStore.ts
    dashboardStore.ts
    datasetStore.ts
    projectStore.ts
  types/
    ai.ts
    chart.ts
    dataset.ts
    project.ts
    report.ts
  utils/
    date.ts
    fieldDetect.ts
    format.ts
    id.ts
    object.ts
  views/
    HomeView.vue
    WorkbenchView.vue
    ReportView.vue
  workers/
    csvParser.worker.ts
    fieldStats.worker.ts
  main.ts
```

## 数据模型

所有核心模型都放在 `src/types` 目录，业务代码禁止临时拼对象。复杂数据结构必须先定义类型。

### Dataset

```ts
// src/types/dataset.ts

export type DatasetFileType = 'csv' | 'excel'

export type FieldType = 'text' | 'number' | 'date' | 'category' | 'boolean' | 'unknown'

export interface Dataset {
  /** 数据集唯一 ID，用于关联项目、图表和报告 */
  id: string

  /** 用户可读的数据集名称，默认使用文件名 */
  name: string

  /** 原始文件名，用于展示和报告说明 */
  fileName: string

  /** 文件类型，决定使用 CSV 解析器还是 Excel 解析器 */
  fileType: DatasetFileType

  /** Excel 当前选中的 Sheet 名称，CSV 不需要 */
  sheetName?: string

  /** 字段模型列表，包含类型识别和统计信息 */
  fields: FieldSchema[]

  /** 表格行数据。第一阶段直接放内存，第二阶段迁移到 IndexedDB */
  rows: DataRow[]

  /** 总行数，用于表格分页、报告和性能提示 */
  rowCount: number

  /** 创建时间戳 */
  createdAt: number

  /** 更新时间戳 */
  updatedAt: number
}

export type DataRow = Record<string, string | number | boolean | null>
```

### FieldSchema

```ts
// src/types/dataset.ts

export interface FieldSchema {
  /** 字段原始名称，对应 CSV 表头或 Excel 第一行 */
  name: string

  /** 字段类型，由自动识别或用户手动修正得到 */
  type: FieldType

  /** 是否存在空值 */
  nullable: boolean

  /** 空值数量 */
  nullCount: number

  /** 唯一值数量 */
  uniqueCount: number

  /** 用于预览和 AI 摘要的样本值 */
  sampleValues: Array<string | number | boolean | null>

  /** 不同字段类型对应不同统计信息 */
  stats?: FieldStats
}

export interface FieldStats {
  /** 数值字段最小值 */
  min?: number

  /** 数值字段最大值 */
  max?: number

  /** 数值字段平均值 */
  mean?: number

  /** 数值字段中位数 */
  median?: number

  /** 日期字段最早时间 */
  earliest?: string

  /** 日期字段最晚时间 */
  latest?: string

  /** 分类字段 Top N 分布 */
  topValues?: Array<{
    value: string
    count: number
  }>
}
```

### ChartConfig

```ts
// src/types/chart.ts

export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'metric'

export type AggregateMethod = 'sum' | 'avg' | 'count' | 'max' | 'min'

export interface ChartConfig {
  /** 图表唯一 ID */
  id: string

  /** 图表类型 */
  type: ChartType

  /** 图表标题 */
  title: string

  /** X 轴字段，柱状图、折线图、散点图需要 */
  xField?: string

  /** Y 轴字段，数值聚合图表需要 */
  yField?: string

  /** 分类或分组字段 */
  categoryField?: string

  /** 聚合方式 */
  aggregate: AggregateMethod

  /** 只展示前 N 项，避免分类过多导致图表不可读 */
  topN?: number

  /** 排序方式 */
  sort?: 'asc' | 'desc' | 'none'

  /** 图表主题 */
  colorTheme?: 'default' | 'business' | 'fresh' | 'contrast'
}

export interface ChartRecommendation {
  /** 推荐项 ID */
  id: string

  /** 推荐图表配置 */
  config: ChartConfig

  /** 推荐理由，用于帮助用户理解为什么适合该图表 */
  reason: string

  /** 推荐优先级，分数越高越靠前 */
  score: number
}
```

### Dashboard

```ts
// src/types/chart.ts

export interface DashboardConfig {
  /** Dashboard 标题 */
  title: string

  /** Dashboard 描述，会出现在报告中 */
  description: string

  /** 图表卡片列表 */
  charts: DashboardChart[]

  /** 当前全局筛选条件 */
  filters: FilterCondition[]
}

export interface DashboardChart {
  /** 图表实例 ID */
  id: string

  /** 图表配置 */
  config: ChartConfig

  /** 布局信息，用于拖拽和调整尺寸 */
  layout: {
    x: number
    y: number
    w: number
    h: number
  }
}

export interface FilterCondition {
  /** 被筛选的字段名 */
  field: string

  /** 筛选操作 */
  operator: 'eq' | 'in' | 'range' | 'contains'

  /** 筛选值。range 使用 [min, max] */
  value: unknown
}
```

### Project

```ts
// src/types/project.ts

import type { DashboardConfig } from './chart'

export interface AnalysisProject {
  /** 项目唯一 ID */
  id: string

  /** 项目名称 */
  name: string

  /** 当前绑定的数据集 ID */
  datasetId: string

  /** Dashboard 配置 */
  dashboard: DashboardConfig

  /** AI 分析记录 */
  aiReports: AiReport[]

  /** 创建时间 */
  createdAt: number

  /** 更新时间 */
  updatedAt: number
}

export interface AiReport {
  /** AI 报告 ID */
  id: string

  /** 报告类型 */
  type: 'summary' | 'trend' | 'risk' | 'business' | 'full-report'

  /** 用户输入或系统生成的提示词标题 */
  promptTitle: string

  /** AI 输出正文，使用 Markdown 格式 */
  content: string

  /** 是否生成完成 */
  finished: boolean

  /** 创建时间 */
  createdAt: number
}
```

## 核心模块实施细节

### 1. 文件上传模块

目标：用户可以拖拽或点击上传 CSV / Excel 文件，系统完成校验和解析。

文件：

- `src/components/upload/FileDropzone.vue`
- `src/components/upload/SheetSelector.vue`
- `src/components/upload/UploadProgress.vue`
- `src/services/parser/csvParser.ts`
- `src/services/parser/excelParser.ts`
- `src/services/parser/normalizeRows.ts`
- `src/stores/datasetStore.ts`

实施步骤：

1. `FileDropzone.vue` 负责接收文件，不做解析。
2. `datasetStore.ts` 负责调用解析服务。
3. `csvParser.ts` 使用 PapaParse 解析 CSV。
4. `excelParser.ts` 使用 xlsx 读取工作簿。
5. `normalizeRows.ts` 统一清洗字段名和空值。
6. 解析完成后写入 `Dataset`。

关键逻辑示例：

```ts
// src/services/parser/normalizeRows.ts

import type { DataRow } from '@/types/dataset'

/**
 * 将解析器输出的原始行数据转换成项目内部统一格式。
 * 注意：这里不做字段类型推断，只负责把空字符串、undefined 等值统一成 null。
 */
export function normalizeRows(rows: Record<string, unknown>[]): DataRow[] {
  return rows.map((row) => {
    const normalizedRow: DataRow = {}

    Object.entries(row).forEach(([key, value]) => {
      const fieldName = key.trim()

      // 空字段名没有分析价值，直接跳过，避免后续图表配置出现空字段。
      if (!fieldName) return

      // 统一空值表达，方便字段统计和筛选逻辑复用。
      normalizedRow[fieldName] = value === '' || value === undefined ? null : (value as DataRow[string])
    })

    return normalizedRow
  })
}
```

验收清单：

- 上传 `.csv` 后能看到字段和数据。
- 上传 `.xlsx` 后能选择 Sheet。
- 上传 `.txt`、图片、压缩包时有错误提示。
- 空文件有错误提示。
- 表头为空时有错误提示。
- 同名字段要自动重命名，例如 `金额`、`金额_2`。

### 2. 字段识别模块

目标：自动判断字段类型，并生成统计信息。

文件：

- `src/utils/fieldDetect.ts`
- `src/composables/useFieldStats.ts`
- `src/workers/fieldStats.worker.ts`
- `src/components/data-table/FieldListPanel.vue`
- `src/components/data-table/FieldStatsCard.vue`

字段识别规则：

- 空值比例超过 95%：`unknown`。
- 可解析为数字的比例超过 80%：`number`。
- 可解析为日期的比例超过 80%：`date`。
- 值只包含 `true/false`、`是/否`、`0/1`：`boolean`。
- 唯一值数量小于等于 30，且唯一值比例小于 30%：`category`。
- 其他：`text`。

关键逻辑示例：

```ts
// src/utils/fieldDetect.ts

import type { FieldType } from '@/types/dataset'

/**
 * 根据样本值推断字段类型。
 * 这里使用启发式规则，不追求 100% 准确，但要保证业务演示场景稳定。
 */
export function detectFieldType(values: unknown[]): FieldType {
  const validValues = values.filter((value) => value !== null && value !== undefined && value !== '')

  // 有效值太少时不做强行判断，避免误导用户。
  if (validValues.length === 0) return 'unknown'

  const numberLikeCount = validValues.filter(isNumberLike).length
  const dateLikeCount = validValues.filter(isDateLike).length
  const booleanLikeCount = validValues.filter(isBooleanLike).length
  const uniqueCount = new Set(validValues.map(String)).size

  if (booleanLikeCount / validValues.length >= 0.9) return 'boolean'
  if (numberLikeCount / validValues.length >= 0.8) return 'number'
  if (dateLikeCount / validValues.length >= 0.8) return 'date'

  // 唯一值少且重复率高的字段更适合作为图表维度。
  if (uniqueCount <= 30 && uniqueCount / validValues.length <= 0.3) return 'category'

  return 'text'
}

function isNumberLike(value: unknown): boolean {
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'string') return false
  return value.trim() !== '' && Number.isFinite(Number(value))
}

function isDateLike(value: unknown): boolean {
  if (typeof value !== 'string' && typeof value !== 'number') return false
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp)
}

function isBooleanLike(value: unknown): boolean {
  const text = String(value).trim().toLowerCase()
  return ['true', 'false', 'yes', 'no', '是', '否', '1', '0'].includes(text)
}
```

验收清单：

- `订单金额` 能识别为 `number`。
- `下单日期` 能识别为 `date`。
- `地区`、`品类` 能识别为 `category`。
- `备注` 能识别为 `text`。
- 用户可以手动修改字段类型。
- 修改字段类型后图表推荐立即刷新。

### 3. 数据预览模块

目标：让用户快速查看数据内容，并在大数据量下保持流畅。

文件：

- `src/components/data-table/DataPreviewTable.vue`
- `src/components/common/EmptyState.vue`
- `src/components/common/LoadingState.vue`

实施步骤：

1. 第一版用 Element Plus 的 `el-table` 展示前 100 行。
2. 第二版增加分页和搜索。
3. 第三版改造成虚拟滚动，只渲染可视区域。

表格行为：

- 默认展示前 100 行。
- 支持字段搜索。
- 支持行关键词搜索。
- 空值显示为 `--`。
- 空值单元格使用浅色背景。
- 字段过多时横向滚动。

验收清单：

- 100 行以内数据正常展示。
- 1 万行数据不会一次性全部渲染。
- 搜索关键字后结果准确。
- 空值有明确视觉提示。

### 4. 图表聚合模块

目标：把原始行数据转换成 ECharts 可以使用的数据。

文件：

- `src/services/chart/aggregate.ts`
- `src/services/chart/optionBuilder.ts`
- `src/composables/useChartData.ts`

聚合规则：

- `sum`：按维度求和。
- `avg`：按维度求平均。
- `count`：按维度计数。
- `max`：按维度求最大值。
- `min`：按维度求最小值。

关键逻辑示例：

```ts
// src/services/chart/aggregate.ts

import type { AggregateMethod } from '@/types/chart'
import type { DataRow } from '@/types/dataset'

export interface AggregateOptions {
  xField: string
  yField?: string
  method: AggregateMethod
  topN?: number
}

export interface AggregateResultItem {
  name: string
  value: number
}

/**
 * 按字段聚合数据，输出图表可直接使用的数据结构。
 * 注意：该函数必须保持纯函数，不能修改 rows，方便单元测试和 Worker 复用。
 */
export function aggregateRows(rows: DataRow[], options: AggregateOptions): AggregateResultItem[] {
  const groupMap = new Map<string, number[]>()

  rows.forEach((row) => {
    const groupName = String(row[options.xField] ?? '未填写')
    const rawValue = options.yField ? row[options.yField] : 1
    const numericValue = Number(rawValue)

    // 非数值在 sum/avg/max/min 场景下没有意义，直接忽略。
    if (options.method !== 'count' && !Number.isFinite(numericValue)) return

    const values = groupMap.get(groupName) ?? []
    values.push(options.method === 'count' ? 1 : numericValue)
    groupMap.set(groupName, values)
  })

  const result = Array.from(groupMap.entries()).map(([name, values]) => ({
    name,
    value: calculateAggregateValue(values, options.method),
  }))

  return result.sort((a, b) => b.value - a.value).slice(0, options.topN ?? result.length)
}

function calculateAggregateValue(values: number[], method: AggregateMethod): number {
  if (values.length === 0) return 0

  if (method === 'count') return values.length
  if (method === 'sum') return values.reduce((sum, value) => sum + value, 0)
  if (method === 'avg') return values.reduce((sum, value) => sum + value, 0) / values.length
  if (method === 'max') return Math.max(...values)
  if (method === 'min') return Math.min(...values)

  return 0
}
```

验收清单：

- 按地区统计销售额总和准确。
- 按品类统计订单数量准确。
- 非数字字段不会导致图表崩溃。
- Top N 能正确截断。
- 聚合函数有单元测试。

### 5. 图表渲染模块

目标：统一封装 ECharts，避免业务组件直接拼复杂 option。

文件：

- `src/components/chart/ChartRenderer.vue`
- `src/components/chart/ChartConfigPanel.vue`
- `src/services/chart/optionBuilder.ts`

组件职责：

- `ChartRenderer.vue` 只负责接收 `ChartConfig` 和 `rows`。
- `optionBuilder.ts` 负责把配置转换成 ECharts option。
- `ChartConfigPanel.vue` 负责编辑字段、聚合方式、图表标题等。

关键逻辑示例：

```ts
// src/services/chart/optionBuilder.ts

import type { EChartsOption } from 'echarts'
import type { ChartConfig } from '@/types/chart'
import type { AggregateResultItem } from './aggregate'

/**
 * 根据统一图表配置生成 ECharts option。
 * 这样组件层不需要关心不同图表类型的细节。
 */
export function buildChartOption(config: ChartConfig, data: AggregateResultItem[]): EChartsOption {
  if (config.type === 'pie') {
    return {
      title: { text: config.title, left: 'center' },
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['35%', '65%'],
          data,
        },
      ],
    }
  }

  return {
    title: { text: config.title },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.map((item) => item.name) },
    yAxis: { type: 'value' },
    series: [
      {
        type: config.type === 'area' ? 'line' : config.type,
        data: data.map((item) => item.value),
        areaStyle: config.type === 'area' ? {} : undefined,
      },
    ],
  }
}
```

验收清单：

- 图表加载、空状态、错误状态完整。
- 容器尺寸变化后图表自动 resize。
- 切换图表类型后不会残留旧 option。
- 所有图表都走同一套配置模型。

### 6. 图表推荐模块

目标：根据字段模型自动生成合理图表建议。

文件：

- `src/services/chart/recommendCharts.ts`
- `src/components/chart/ChartRecommendationList.vue`

推荐规则落地：

| 条件 | 推荐图表 | 示例 |
| --- | --- | --- |
| 分类字段 + 数值字段 | 柱状图 | 各地区销售额 |
| 分类字段 + 数值字段 | 饼图 | 各品类销售占比 |
| 日期字段 + 数值字段 | 折线图 | 每日销售趋势 |
| 两个数值字段 | 散点图 | 销售额和利润关系 |
| 单个数值字段 | 指标卡 | 总销售额 |
| 分类字段 | 柱状图 | 各渠道用户数 |

关键逻辑示例：

```ts
// src/services/chart/recommendCharts.ts

import type { ChartRecommendation } from '@/types/chart'
import type { FieldSchema } from '@/types/dataset'
import { createId } from '@/utils/id'

/**
 * 根据字段类型生成图表推荐。
 * 推荐算法先使用明确规则，后续可以扩展为打分模型。
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
          title: `${categoryField.name}维度的${numberField.name}对比`,
          xField: categoryField.name,
          yField: numberField.name,
          aggregate: 'sum',
          topN: 10,
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

  return recommendations.sort((a, b) => b.score - a.score)
}
```

验收清单：

- 销售数据能推荐销售趋势图。
- 地区字段和销售额字段能推荐地区销售对比图。
- 推荐项包含推荐理由。
- 推荐项可以一键添加到 Dashboard。

### 7. Dashboard 模块

目标：让用户把多个图表组合成分析看板。

文件：

- `src/components/dashboard/DashboardCanvas.vue`
- `src/components/dashboard/DashboardChartCard.vue`
- `src/components/dashboard/DashboardToolbar.vue`
- `src/stores/dashboardStore.ts`
- `src/composables/useDashboard.ts`

实施顺序：

1. 第一版用 CSS Grid 展示图表卡片。
2. 支持添加和删除图表。
3. 支持编辑图表配置。
4. 支持保存到 localStorage。
5. 第二版接入拖拽布局库。
6. 第三版支持图表联动筛选。

验收清单：

- 用户能添加多个图表。
- 每个图表配置互不影响。
- 刷新页面后 Dashboard 能恢复。
- 删除图表后本地缓存同步更新。

### 8. 联动筛选模块

目标：点击某个图表的维度项后，其他图表同步过滤。

文件：

- `src/components/dashboard/FilterBar.vue`
- `src/stores/dashboardStore.ts`
- `src/services/chart/aggregate.ts`

实施步骤：

1. 在 `dashboardStore` 中维护 `filters`。
2. `ChartRenderer` 监听 ECharts 点击事件。
3. 点击维度项后新增筛选条件。
4. 聚合前先应用筛选条件。
5. `FilterBar` 展示当前筛选条件并支持删除。

验收清单：

- 点击地区图表中的「华东」后，其他图表只展示华东数据。
- 删除筛选条件后恢复全量数据。
- 多个筛选条件可以同时生效。

### 9. AI 分析模块

目标：AI 不读取全量明细，只基于摘要生成分析。

文件：

- `src/services/ai/aiClient.ts`
- `src/services/ai/mockAiClient.ts`
- `src/services/ai/promptBuilder.ts`
- `src/services/ai/streamReader.ts`
- `src/components/ai/AiAnalysisPanel.vue`
- `src/components/ai/AiMessageStream.vue`
- `src/stores/aiStore.ts`

AI 请求上下文必须包含：

- 数据集名称。
- 行数和字段数。
- 字段类型摘要。
- 数值字段统计。
- 分类字段 Top N。
- 日期范围。
- 当前 Dashboard 图表列表。
- 当前筛选条件。
- 用户选择的分析目标。

Prompt 构造示例：

```ts
// src/services/ai/promptBuilder.ts

import type { Dataset } from '@/types/dataset'
import type { DashboardConfig } from '@/types/chart'

/**
 * 构造 AI 分析提示词。
 * 注意：禁止传入全量 rows，只允许传字段摘要和统计信息，避免上下文过长和数据泄露。
 */
export function buildAnalysisPrompt(dataset: Dataset, dashboard: DashboardConfig): string {
  const fieldSummary = dataset.fields
    .map((field) => {
      return `- ${field.name}: 类型=${field.type}, 空值=${field.nullCount}, 唯一值=${field.uniqueCount}`
    })
    .join('\n')

  const chartSummary = dashboard.charts
    .map((chart) => {
      return `- ${chart.config.title}: ${chart.config.type}, X=${chart.config.xField ?? '无'}, Y=${chart.config.yField ?? '无'}`
    })
    .join('\n')

  return `
你是一名数据分析师，请基于下面的数据摘要生成分析报告。

要求：
1. 使用中文回答。
2. 先总结核心发现，再给出业务建议。
3. 不要编造原始数据中不存在的字段。
4. 如果数据不足，要明确说明限制。

数据集：
- 名称：${dataset.name}
- 行数：${dataset.rowCount}
- 字段数：${dataset.fields.length}

字段摘要：
${fieldSummary}

Dashboard 图表：
${chartSummary}
`.trim()
}
```

Mock 流式输出示例：

```ts
// src/services/ai/mockAiClient.ts

/**
 * 模拟 AI 流式输出。
 * 开源演示环境没有 API Key 时使用它，保证用户下载仓库后能直接体验。
 */
export async function* createMockAiStream(): AsyncGenerator<string> {
  const chunks = [
    '## 数据概览\n\n',
    '当前数据集包含多个业务字段，可以从趋势、结构和异常三个角度分析。\n\n',
    '## 核心发现\n\n',
    '1. 数值字段可以用于观察规模和增长情况。\n',
    '2. 分类字段可以用于对比不同维度的表现差异。\n',
    '3. 日期字段可以用于识别周期性波动。\n\n',
    '## 建议\n\n',
    '建议优先关注贡献最高的分类维度，并结合时间趋势判断是否存在异常波动。\n',
  ]

  for (const chunk of chunks) {
    await new Promise((resolve) => window.setTimeout(resolve, 250))
    yield chunk
  }
}
```

验收清单：

- 无 API Key 时走 Mock。
- 有 API Key 时走真实接口。
- 输出是流式出现，不是等待完整结果。
- 可以停止生成。
- 可以重新生成。
- AI 分析结果保存到项目。

### 10. 报告导出模块

目标：把 Dashboard、图表和 AI 结论组合成正式报告。

文件：

- `src/views/ReportView.vue`
- `src/components/report/ReportPreview.vue`
- `src/components/report/ReportToolbar.vue`
- `src/services/report/reportBuilder.ts`
- `src/services/report/exportMarkdown.ts`
- `src/services/report/exportHtml.ts`
- `src/services/report/exportPdf.ts`

报告结构：

1. 报告标题。
2. 数据集说明。
3. 字段摘要。
4. 核心指标。
5. 图表分析。
6. AI 分析结论。
7. 业务建议。
8. 生成时间。

Markdown 生成示例：

```ts
// src/services/report/reportBuilder.ts

import type { Dataset } from '@/types/dataset'
import type { AnalysisProject } from '@/types/project'

/**
 * 生成 Markdown 报告。
 * Markdown 是最稳定的第一阶段导出格式，PDF 可以基于报告页后续增强。
 */
export function buildMarkdownReport(project: AnalysisProject, dataset: Dataset): string {
  const latestAiReport = project.aiReports.at(-1)

  return `
# ${project.name}

## 数据集概览

- 数据集名称：${dataset.name}
- 原始文件：${dataset.fileName}
- 数据行数：${dataset.rowCount}
- 字段数量：${dataset.fields.length}

## 字段摘要

${dataset.fields.map((field) => `- ${field.name}：${field.type}，空值 ${field.nullCount}，唯一值 ${field.uniqueCount}`).join('\n')}

## Dashboard 图表

${project.dashboard.charts.map((chart) => `- ${chart.config.title}：${chart.config.type}`).join('\n')}

## AI 分析结论

${latestAiReport?.content ?? '暂无 AI 分析结论。'}

---

生成时间：${new Date().toLocaleString()}
`.trim()
}
```

验收清单：

- Markdown 能导出。
- HTML 能导出。
- PDF 能导出。
- 报告包含图表标题和 AI 结论。
- 没有 AI 结论时报告仍能生成。

### 11. 本地存储模块

目标：刷新页面后恢复项目配置，并支持多项目管理。

文件：

- `src/services/storage/projectStorage.ts`
- `src/services/storage/indexedDb.ts`
- `src/stores/projectStore.ts`

存储分层：

- localStorage：保存最近项目 ID、用户偏好、轻量配置。
- IndexedDB：保存数据集、项目、AI 报告。
- 导出 JSON：用户手动备份项目。

localStorage 第一阶段示例：

```ts
// src/services/storage/projectStorage.ts

import type { AnalysisProject } from '@/types/project'

const PROJECT_STORAGE_KEY = 'ai-data-analysis-workbench:projects'

/**
 * 保存项目列表到 localStorage。
 * 第一阶段只保存配置，不保存大体量 rows；大数据持久化放到 IndexedDB 阶段处理。
 */
export function saveProjects(projects: AnalysisProject[]): void {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects))
}

export function loadProjects(): AnalysisProject[] {
  const rawValue = localStorage.getItem(PROJECT_STORAGE_KEY)
  if (!rawValue) return []

  try {
    return JSON.parse(rawValue) as AnalysisProject[]
  } catch {
    // 存储内容损坏时返回空数组，避免应用启动失败。
    return []
  }
}
```

验收清单：

- 刷新页面后项目列表还在。
- Dashboard 配置可以恢复。
- 可以删除项目。
- 可以导出项目 JSON。
- 可以导入项目 JSON。

## 页面设计

### 首页 `/`

用途：项目入口、上传入口、最近项目入口。

页面区域：

- 顶部项目标题和 GitHub 链接。
- 主上传区。
- 最近项目列表。
- 示例数据入口。

必须状态：

- 无项目状态。
- 上传中状态。
- 上传失败状态。
- 最近项目列表为空状态。

### 工作台 `/workbench/:projectId`

用途：核心分析页面。

布局：

- 顶部工具栏：上传、保存、生成 AI 分析、导出报告。
- 左侧面板：字段列表、字段统计、筛选条件。
- 中间区域：表格预览 / Dashboard 切换。
- 右侧面板：图表推荐、图表配置、AI 分析。

交互：

- 上传数据后自动进入表格预览。
- 字段识别完成后展示推荐图表。
- 点击推荐图表可以添加到 Dashboard。
- 点击图表卡片可以编辑配置。
- 点击 AI 按钮开始流式分析。

### 报告页 `/report/:projectId`

用途：预览和导出报告。

页面区域：

- 报告标题。
- 数据集概览。
- 字段摘要。
- 图表列表。
- AI 分析结论。
- 导出按钮。

交互：

- 导出 Markdown。
- 导出 HTML。
- 导出 PDF。
- 返回工作台继续编辑。

## 状态管理设计

### datasetStore

职责：

- 当前数据集。
- 文件解析状态。
- 字段识别状态。
- 表格搜索关键字。

必须提供方法：

- `parseFile(file: File): Promise<void>`
- `setCurrentDataset(dataset: Dataset): void`
- `updateFieldType(fieldName: string, type: FieldType): void`
- `clearDataset(): void`

### dashboardStore

职责：

- 当前 Dashboard。
- 当前选中图表。
- 全局筛选条件。

必须提供方法：

- `addChart(config: ChartConfig): void`
- `removeChart(chartId: string): void`
- `updateChart(chartId: string, config: Partial<ChartConfig>): void`
- `addFilter(filter: FilterCondition): void`
- `removeFilter(index: number): void`
- `clearFilters(): void`

### aiStore

职责：

- AI 生成状态。
- 当前流式内容。
- 历史 AI 报告。
- 停止生成控制器。

必须提供方法：

- `generateAnalysis(): Promise<void>`
- `stopGeneration(): void`
- `saveCurrentReport(): void`
- `clearCurrentOutput(): void`

### projectStore

职责：

- 项目列表。
- 当前项目。
- 保存和恢复。

必须提供方法：

- `createProject(name: string): AnalysisProject`
- `saveCurrentProject(): void`
- `loadProject(projectId: string): void`
- `deleteProject(projectId: string): void`
- `exportProject(projectId: string): void`
- `importProject(file: File): Promise<void>`

## 开发阶段计划

### 阶段 0：工程初始化

目标：建立正式开源项目骨架。

具体任务：

- 初始化 Vue 3 + TypeScript + Vite。
- 安装依赖。
- 配置路由。
- 配置 Pinia。
- 配置 Element Plus。
- 配置 ESLint、Prettier、Vitest。
- 创建目录结构。
- 创建 `.env.example`。
- 创建 `.gitignore`。
- 创建 `LICENSE`。
- 创建 `CONTRIBUTING.md`。
- 创建 `CHANGELOG.md`。
- 创建 `docs/` 目录。

建议提交：

```bash
git add .
git commit -m "chore: initialize vue data analysis workbench"
```

验收：

- `npm run dev` 正常启动。
- `npm run build` 成功。
- `npm run typecheck` 成功。

### 阶段 1：上传和 CSV 解析

目标：打通上传到数据预览链路。

具体任务：

- 创建 `FileDropzone.vue`。
- 创建 `csvParser.ts`。
- 创建 `normalizeRows.ts`。
- 创建 `datasetStore.ts`。
- 上传 CSV 后写入 store。
- 工作台展示字段和前 100 行。

建议提交：

```bash
git add .
git commit -m "feat: support csv upload and preview"
```

验收：

- 上传 `sales.csv` 能展示数据。
- 空 CSV 有错误提示。
- 不支持的文件类型有错误提示。

### 阶段 2：字段识别和统计

目标：让系统理解数据。

具体任务：

- 创建 `fieldDetect.ts`。
- 创建字段统计函数。
- 创建 `FieldListPanel.vue`。
- 创建 `FieldStatsCard.vue`。
- 支持手动修改字段类型。

建议提交：

```bash
git add .
git commit -m "feat: add field detection and data profiling"
```

验收：

- 日期、数值、分类字段识别正确。
- 字段统计显示准确。
- 修改字段类型后状态同步。

### 阶段 3：基础图表

目标：用户可以手动配置图表。

具体任务：

- 创建 `aggregate.ts`。
- 创建 `optionBuilder.ts`。
- 创建 `ChartRenderer.vue`。
- 创建 `ChartConfigPanel.vue`。
- 支持柱状图、折线图、饼图。

建议提交：

```bash
git add .
git commit -m "feat: render configurable charts"
```

验收：

- 选择 X / Y 字段后生成图表。
- 切换聚合方式后图表更新。
- 数据为空时展示空状态。

### 阶段 4：图表推荐

目标：系统自动推荐分析视角。

具体任务：

- 创建 `recommendCharts.ts`。
- 创建 `ChartRecommendationList.vue`。
- 推荐项展示标题、类型和理由。
- 支持一键添加到 Dashboard。

建议提交：

```bash
git add .
git commit -m "feat: recommend charts by field schema"
```

验收：

- 销售数据推荐趋势图、分类对比图、占比图。
- 推荐顺序合理。
- 推荐图表能加入 Dashboard。

### 阶段 5：Dashboard

目标：形成可编辑看板。

具体任务：

- 创建 `DashboardCanvas.vue`。
- 创建 `DashboardChartCard.vue`。
- 创建 `dashboardStore.ts`。
- 支持添加、删除、编辑图表。
- 支持 localStorage 保存。

建议提交：

```bash
git add .
git commit -m "feat: add editable dashboard"
```

验收：

- 多个图表能同时展示。
- 刷新页面后配置恢复。
- 删除图表后不会残留配置。

### 阶段 6：AI Mock 和流式 UI

目标：无后端也能演示 AI 能力。

具体任务：

- 创建 `promptBuilder.ts`。
- 创建 `mockAiClient.ts`。
- 创建 `streamReader.ts`。
- 创建 `AiAnalysisPanel.vue`。
- 支持开始、停止、重新生成。

建议提交：

```bash
git add .
git commit -m "feat: add mock ai streaming analysis"
```

验收：

- 点击生成后逐段输出。
- 停止按钮有效。
- 输出结果能保存。

### 阶段 7：报告导出

目标：完成分析闭环。

具体任务：

- 创建 `ReportView.vue`。
- 创建 `reportBuilder.ts`。
- 创建 `exportMarkdown.ts`。
- 创建 `exportHtml.ts`。
- 第一版先完成 Markdown 导出。
- 第二版补 HTML 和 PDF。

建议提交：

```bash
git add .
git commit -m "feat: export analysis report"
```

验收：

- Markdown 报告可下载。
- 报告内容包含数据集、字段、图表和 AI 结论。
- 没有 AI 结论时仍可导出。

### 阶段 8：Excel 和 Worker 优化

目标：补齐复杂文件和性能亮点。

具体任务：

- 创建 `excelParser.ts`。
- 创建 `csvParser.worker.ts`。
- 创建 `fieldStats.worker.ts`。
- 将解析和统计下沉到 Worker。
- 支持解析进度。
- 支持取消解析。

建议提交：

```bash
git add .
git commit -m "perf: parse large files in web workers"
```

验收：

- Excel 多 Sheet 可解析。
- 5 万行 CSV 解析时页面不卡死。
- 解析进度可见。

### 阶段 9：联动筛选

目标：让 Dashboard 接近真实 BI 工具。

具体任务：

- 图表点击事件生成筛选条件。
- `FilterBar.vue` 展示筛选条件。
- 聚合前应用筛选。
- 支持清空筛选。

建议提交：

```bash
git add .
git commit -m "feat: add dashboard cross filtering"
```

验收：

- 点击维度项后其他图表联动刷新。
- 多筛选条件同时生效。
- 清空筛选后恢复全量数据。

### 阶段 10：测试、文档和部署

目标：达到正式开源项目质量。

具体任务：

- 为 `fieldDetect.ts` 写单元测试。
- 为 `aggregate.ts` 写单元测试。
- 为 `recommendCharts.ts` 写单元测试。
- 用 Playwright 测上传、图表、导出流程。
- 补充示例数据。
- 补充截图。
- 配置 GitHub Actions。
- 部署到 Vercel 或 Netlify。

建议提交：

```bash
git add .
git commit -m "test: add core workflow coverage"
```

验收：

- `npm run lint` 通过。
- `npm run typecheck` 通过。
- `npm run test` 通过。
- `npm run build` 通过。
- README 有截图和启动方式。

## 测试计划

### 单元测试

必须覆盖：

- `detectFieldType`
- `aggregateRows`
- `recommendCharts`
- `buildMarkdownReport`
- `normalizeRows`

示例：

```ts
// src/utils/fieldDetect.test.ts

import { describe, expect, it } from 'vitest'
import { detectFieldType } from './fieldDetect'

describe('detectFieldType', () => {
  it('识别数值字段', () => {
    expect(detectFieldType(['1', '2', '3'])).toBe('number')
  })

  it('识别分类字段', () => {
    expect(detectFieldType(['华东', '华南', '华东', '华北'])).toBe('category')
  })
})
```

### 端到端测试

必须覆盖：

- 首页上传 CSV。
- 工作台展示表格。
- 添加推荐图表。
- 生成 AI Mock 分析。
- 导出 Markdown 报告。

示例：

```ts
// e2e/workbench.spec.ts

import { expect, test } from '@playwright/test'

test('用户可以上传 CSV 并生成报告', async ({ page }) => {
  await page.goto('/')

  // 上传示例数据后，页面应该进入工作台并展示字段。
  await page.getByTestId('file-input').setInputFiles('examples/sales.csv')
  await expect(page.getByText('字段列表')).toBeVisible()

  // 添加第一条推荐图表。
  await page.getByRole('button', { name: '添加到看板' }).first().click()
  await expect(page.getByTestId('dashboard-chart-card')).toBeVisible()

  // 生成 Mock AI 分析。
  await page.getByRole('button', { name: '生成 AI 分析' }).click()
  await expect(page.getByText('数据概览')).toBeVisible()
})
```

## 中文注释规范

本项目要求关键逻辑使用中文注释，但不要给每一行都写废话注释。

必须写注释的地方：

- 字段识别规则。
- 数据聚合算法。
- Worker 消息协议。
- AI Prompt 构造。
- 报告导出逻辑。
- IndexedDB 表结构。
- 兼容性处理和边界处理。

不需要写注释的地方：

- 简单变量赋值。
- 明显的组件 props。
- 一眼能看懂的 if 判断。
- 与函数名重复的解释。

推荐注释风格：

```ts
/**
 * 统计字段质量信息。
 * 这里会被主线程和 Worker 同时调用，所以必须保持纯函数。
 */
export function profileField(values: unknown[]) {
  // 空值统一在这里判断，避免不同模块对空字符串和 null 的理解不一致。
  const emptyValues = values.filter((value) => value === null || value === undefined || value === '')

  return {
    nullCount: emptyValues.length,
  }
}
```

不推荐：

```ts
// 定义 count 变量
const count = 0
```

## 代码规范

### 命名规范

- 组件文件：`PascalCase.vue`，例如 `ChartRenderer.vue`。
- 工具函数：`camelCase.ts`，例如 `fieldDetect.ts`。
- Store 文件：`xxxStore.ts`，例如 `datasetStore.ts`。
- 类型文件：按领域命名，例如 `dataset.ts`、`chart.ts`。
- Worker 文件：`xxx.worker.ts`。

### 组件规范

- 组件只负责 UI 和交互，不直接写复杂业务算法。
- 数据解析、聚合、AI 请求必须放到 `services`。
- 可复用状态放到 `composables`。
- 全局共享状态放到 `stores`。

### TypeScript 规范

- 禁止使用 `any`，确实无法确定时使用 `unknown`。
- 所有服务函数必须显式声明返回类型。
- 所有核心业务对象必须有 interface。
- 对外导出的函数必须有清晰命名。

### UI 规范

- 管理类界面保持简洁、密度适中。
- 操作按钮使用图标加文字。
- 表格、图表、AI 面板都要有 Loading、Empty、Error 状态。
- 不使用过度装饰的营销页风格。
- 工作台第一屏必须直接可操作，不做纯展示落地页。

## 示例数据

仓库已经内置示例数据，并且首页可以一键加载：

- `examples/sales.csv`：销售经营分析。
- `examples/users.csv`：用户增长分析。

`examples/sales.csv` 内容：

```csv
订单日期,地区,品类,销售额,利润,客户类型
2026-01-01,华东,办公用品,1200,240,企业客户
2026-01-02,华南,电子产品,5600,860,个人客户
2026-01-03,华北,家具,3200,400,企业客户
2026-01-04,华东,电子产品,7800,1200,企业客户
2026-01-05,西南,办公用品,900,120,个人客户
```

创建 `examples/users.csv`：

```csv
注册日期,渠道,城市,年龄,活跃状态,付费金额
2026-02-01,搜索广告,上海,28,是,199
2026-02-02,自然流量,广州,34,否,0
2026-02-03,社交媒体,北京,22,是,49
2026-02-04,搜索广告,深圳,41,是,299
```

验收时至少使用这两份数据测试。

## 开源项目必备文件

正式开源前补齐：

```text
LICENSE
CONTRIBUTING.md
CHANGELOG.md
CODE_OF_CONDUCT.md
.env.example
.gitignore
.github/
  workflows/
    ci.yml
docs/
  architecture.md
  development.md
  deployment.md
examples/
  sales.csv
  users.csv
```

### CONTRIBUTING.md 内容要求

- 如何安装依赖。
- 如何启动项目。
- 如何运行测试。
- 分支命名规范。
- Commit 规范。
- PR 提交流程。
- Issue 模板说明。

### CHANGELOG.md 内容要求

使用 Keep a Changelog 风格：

```md
# Changelog

## [Unreleased]

### Added

- 初始化 AI 数据分析工作台项目。
```

### GitHub Actions

`.github/workflows/ci.yml`：

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install
        run: npm ci

      - name: Typecheck
        run: npm run typecheck

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build
```

## 验收标准

### 功能验收

- 用户可以上传 CSV。
- 用户可以上传 Excel。
- 用户可以看到字段列表。
- 用户可以看到数据预览。
- 用户可以看到字段统计。
- 用户可以手动修正字段类型。
- 用户可以生成图表。
- 用户可以看到图表推荐。
- 用户可以编辑 Dashboard。
- 用户可以保存项目。
- 用户可以生成 AI 分析。
- 用户可以导出报告。

### 性能验收

- 1 万行 CSV 可以正常解析和预览。
- 5 万行 CSV 解析时页面不明显卡死。
- Dashboard 中 6 个图表同时展示时交互正常。
- AI 流式输出时页面可以继续滚动和操作。

### 工程验收

- `npm run lint` 通过。
- `npm run typecheck` 通过。
- `npm run test` 通过。
- `npm run build` 通过。
- 关键模块有中文注释。
- README 可以指导新人启动和开发。
- 示例数据可以直接用于演示。

## 面试讲解提纲

可以按下面顺序讲：

1. 项目为什么选择做浏览器端数据分析工作台。
2. CSV / Excel 解析后的数据如何统一建模。
3. 字段类型识别规则如何设计。
4. 图表推荐规则如何根据字段类型生成。
5. ECharts option 如何封装，避免组件层复杂化。
6. Dashboard 状态如何拆分到 Pinia。
7. 大文件解析为什么要放到 Web Worker。
8. AI 为什么不能传全量数据，如何构造摘要 Prompt。
9. 报告导出如何从 Markdown 开始逐步增强到 PDF。
10. 项目如何通过测试和 CI 保证质量。

## 开发时间表

如果每天投入 2 到 4 小时，建议节奏如下：

| 天数 | 目标 | 产出 |
| --- | --- | --- |
| 第 1 天 | 初始化工程 | 项目可启动、路由可访问 |
| 第 2 天 | CSV 上传解析 | 上传后能看到表格 |
| 第 3 天 | 字段识别统计 | 字段面板和统计卡片 |
| 第 4 天 | 基础图表 | 可手动生成图表 |
| 第 5 天 | 图表推荐和 Dashboard | 可一键加入看板 |
| 第 6 天 | Mock AI 流式分析 | 可生成分析文字 |
| 第 7 天 | Markdown 报告导出 | 完成 MVP 闭环 |
| 第 8 天 | Excel 解析 | 多 Sheet 支持 |
| 第 9 天 | Web Worker 优化 | 大文件不卡主线程 |
| 第 10 天 | 测试、文档、部署 | 达到开源展示质量 |

## 版本规划

### v0.1.0 MVP

- CSV 上传。
- 表格预览。
- 字段识别。
- 基础图表。
- 图表推荐。
- Dashboard。
- Mock AI。
- Markdown 导出。

### v0.2.0 Enhanced

- Excel 解析。
- Web Worker。
- 虚拟滚动。
- HTML / PDF 导出。
- 多项目管理。

### v0.3.0 BI Features

- 联动筛选。
- 自定义计算字段。
- 数据清洗。
- 图表主题。
- IndexedDB 完整持久化。

### v1.0.0 Stable

- 真实 AI API。
- 完整测试覆盖。
- CI/CD。
- 在线演示。
- 完整英文文档。

## 风险和解决方案

### 大文件导致页面卡顿

解决方案：

- 解析放入 Web Worker。
- 表格使用虚拟滚动。
- 图表只使用聚合结果，不直接渲染全量点。

### AI 上下文太长

解决方案：

- 只发送字段统计和采样摘要。
- 分类字段只发送 Top N。
- 数值字段只发送 min、max、mean、median。
- 日期字段只发送范围和趋势摘要。

### 图表配置越来越复杂

解决方案：

- 统一 `ChartConfig`。
- 每种图表独立 option builder。
- 聚合逻辑与渲染逻辑分离。

### PDF 导出样式不稳定

解决方案：

- 第一阶段先导出 Markdown。
- 第二阶段导出 HTML。
- 第三阶段用专门报告页导出 PDF。
- 图表先转成图片再放入报告。

## 最终交付清单

- Vue 3 + TypeScript 完整源码。
- 可运行的开发环境。
- 示例 CSV / Excel 数据。
- 完整 README。
- 开源协议。
- 贡献指南。
- 变更日志。
- GitHub Actions。
- 单元测试。
- 端到端测试。
- 在线演示地址。
- 项目截图。
- 面试讲解稿。

## License

建议使用 MIT License。

```text
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```
