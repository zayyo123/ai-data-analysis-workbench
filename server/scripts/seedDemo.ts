import { prisma } from '../src/prisma.js'
import { hashPassword } from '../src/utils/password.js'

const DEMO_EMAIL = 'demo@example.com'
const DEMO_PASSWORD = 'password123'

const fields = [
  {
    name: '订单日期',
    type: 'date',
    nullable: false,
    nullCount: 0,
    uniqueCount: 8,
    sampleValues: ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04', '2026-01-05'],
    stats: { earliest: '2026-01-01', latest: '2026-01-08' },
  },
  {
    name: '地区',
    type: 'category',
    nullable: false,
    nullCount: 0,
    uniqueCount: 4,
    sampleValues: ['华东', '华南', '华北', '西南'],
    stats: {
      topValues: [
        { value: '华东', count: 3 },
        { value: '华南', count: 2 },
        { value: '华北', count: 2 },
        { value: '西南', count: 1 },
      ],
    },
  },
  {
    name: '品类',
    type: 'category',
    nullable: false,
    nullCount: 0,
    uniqueCount: 3,
    sampleValues: ['办公用品', '电子产品', '家具'],
    stats: {
      topValues: [
        { value: '办公用品', count: 3 },
        { value: '电子产品', count: 3 },
        { value: '家具', count: 2 },
      ],
    },
  },
  {
    name: '销售额',
    type: 'number',
    nullable: false,
    nullCount: 0,
    uniqueCount: 8,
    sampleValues: [1200, 5600, 3200, 7800, 900],
    stats: { min: 900, max: 9400, mean: 4025, median: 2900 },
  },
  {
    name: '利润',
    type: 'number',
    nullable: false,
    nullCount: 0,
    uniqueCount: 8,
    sampleValues: [240, 860, 400, 1200, 120],
    stats: { min: 120, max: 1600, mean: 622.5, median: 350 },
  },
  {
    name: '客户类型',
    type: 'category',
    nullable: false,
    nullCount: 0,
    uniqueCount: 2,
    sampleValues: ['企业客户', '个人客户'],
    stats: {
      topValues: [
        { value: '企业客户', count: 5 },
        { value: '个人客户', count: 3 },
      ],
    },
  },
]

const sampleRows = [
  { 订单日期: '2026-01-01', 地区: '华东', 品类: '办公用品', 销售额: 1200, 利润: 240, 客户类型: '企业客户' },
  { 订单日期: '2026-01-02', 地区: '华南', 品类: '电子产品', 销售额: 5600, 利润: 860, 客户类型: '个人客户' },
  { 订单日期: '2026-01-03', 地区: '华北', 品类: '家具', 销售额: 3200, 利润: 400, 客户类型: '企业客户' },
  { 订单日期: '2026-01-04', 地区: '华东', 品类: '电子产品', 销售额: 7800, 利润: 1200, 客户类型: '企业客户' },
  { 订单日期: '2026-01-05', 地区: '西南', 品类: '办公用品', 销售额: 900, 利润: 120, 客户类型: '个人客户' },
  { 订单日期: '2026-01-06', 地区: '华南', 品类: '家具', 销售额: 2600, 利润: 300, 客户类型: '企业客户' },
  { 订单日期: '2026-01-07', 地区: '华北', 品类: '办公用品', 销售额: 1600, 利润: 260, 客户类型: '个人客户' },
  { 订单日期: '2026-01-08', 地区: '华东', 品类: '电子产品', 销售额: 9400, 利润: 1600, 客户类型: '企业客户' },
]

const dashboard = {
  title: '销售经营分析 演示看板',
  description: '面向销售复盘和商业演示预置的云端 Dashboard。',
  filters: [],
  charts: [
    {
      id: 'demo-chart-sales-trend',
      config: {
        id: 'demo-chart-sales-trend',
        type: 'line',
        title: '销售额趋势',
        xField: '订单日期',
        yField: '销售额',
        aggregate: 'sum',
        sort: 'asc',
      },
      layout: { x: 0, y: 0, w: 6, h: 3 },
    },
    {
      id: 'demo-chart-region-sales',
      config: {
        id: 'demo-chart-region-sales',
        type: 'bar',
        title: '地区销售额对比',
        xField: '地区',
        yField: '销售额',
        aggregate: 'sum',
        topN: 10,
        sort: 'desc',
      },
      layout: { x: 6, y: 0, w: 6, h: 3 },
    },
    {
      id: 'demo-chart-category-profit',
      config: {
        id: 'demo-chart-category-profit',
        type: 'pie',
        title: '品类利润占比',
        xField: '品类',
        yField: '利润',
        aggregate: 'sum',
        topN: 8,
        sort: 'desc',
      },
      layout: { x: 0, y: 3, w: 6, h: 3 },
    },
  ],
}

const reportContent = `## 核心发现

1. 华东区域在样本周期内贡献了最高销售额，适合作为重点复盘对象。
2. 电子产品兼具高销售额和高利润，应优先观察库存、转化和复购表现。
3. 办公用品订单更分散，可作为稳定引流品类继续优化客单价。

## 经营建议

- 建议把华东电子产品作为下一轮销售活动的主推组合。
- 对低利润订单做二次拆解，区分折扣、渠道成本和履约成本影响。
- 将该看板作为周报模板，后续接入定时生成和团队共享能力。

## 商业化价值

这个演示账号展示了从云端项目、用量套餐到 AI 报告归档的完整 SaaS 闭环，适合产品演示、客户试用和投资人 Demo。`

async function seedDemo() {
  const passwordHash = await hashPassword(DEMO_PASSWORD)

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      name: 'Demo Analyst',
      passwordHash,
      plan: 'PRO',
    },
    create: {
      email: DEMO_EMAIL,
      name: 'Demo Analyst',
      passwordHash,
      plan: 'PRO',
    },
  })

  const dataset = await prisma.dataset.upsert({
    where: { id: 'demo-sales-dataset' },
    update: {
      userId: user.id,
      name: '销售经营分析',
      fileName: 'sales.csv',
      fileType: 'csv',
      rowCount: sampleRows.length,
      fieldCount: fields.length,
      fieldsJson: JSON.stringify(fields),
      sampleJson: JSON.stringify(sampleRows),
    },
    create: {
      id: 'demo-sales-dataset',
      userId: user.id,
      name: '销售经营分析',
      fileName: 'sales.csv',
      fileType: 'csv',
      rowCount: sampleRows.length,
      fieldCount: fields.length,
      fieldsJson: JSON.stringify(fields),
      sampleJson: JSON.stringify(sampleRows),
    },
  })

  const project = await prisma.project.upsert({
    where: { id: 'demo-sales-project' },
    update: {
      userId: user.id,
      datasetId: dataset.id,
      name: '销售经营分析演示项目',
      dashboardJson: JSON.stringify(dashboard),
      filtersJson: JSON.stringify([]),
    },
    create: {
      id: 'demo-sales-project',
      userId: user.id,
      datasetId: dataset.id,
      name: '销售经营分析演示项目',
      dashboardJson: JSON.stringify(dashboard),
      filtersJson: JSON.stringify([]),
    },
  })

  await prisma.aiReport.deleteMany({
    where: {
      userId: user.id,
      projectId: project.id,
      promptTitle: 'Demo 商业分析报告',
    },
  })

  await prisma.aiReport.create({
    data: {
      userId: user.id,
      projectId: project.id,
      type: 'business',
      promptTitle: 'Demo 商业分析报告',
      content: reportContent,
      tokenUsage: 980,
    },
  })

  await prisma.usageLog.deleteMany({
    where: {
      userId: user.id,
      action: 'ai.analyze',
    },
  })

  await prisma.usageLog.create({
    data: {
      userId: user.id,
      action: 'ai.analyze',
      amount: 1,
    },
  })

  return { user, dataset, project }
}

try {
  const result = await seedDemo()
  // 这里输出固定账号信息，方便部署环境初始化后直接复制到演示脚本中使用。
  console.log('Demo seed completed.')
  console.log(`Email: ${DEMO_EMAIL}`)
  console.log(`Password: ${DEMO_PASSWORD}`)
  console.log(`User: ${result.user.id}`)
  console.log(`Project: ${result.project.id}`)
} finally {
  await prisma.$disconnect()
}
