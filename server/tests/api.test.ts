import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/app.js'
import { prisma } from '../src/prisma.js'

const app = buildApp()

beforeAll(async () => {
  await prisma.usageLog.deleteMany()
  await prisma.aiReport.deleteMany()
  await prisma.project.deleteMany()
  await prisma.dataset.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

describe('full-stack API MVP', () => {
  it('registers, saves dataset/project, generates AI report and reads usage', async () => {
    const registerResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'demo@example.com',
        password: 'password123',
        name: 'Demo',
      },
    })

    expect(registerResponse.statusCode).toBe(200)
    const registerBody = registerResponse.json<{ token: string }>()
    const authHeader = `Bearer ${registerBody.token}`

    const datasetResponse = await app.inject({
      method: 'POST',
      url: '/api/datasets',
      headers: { authorization: authHeader },
      payload: {
        name: 'Sales',
        fileName: 'sales.csv',
        fileType: 'csv',
        rowCount: 2,
        fields: [{ name: '销售额', type: 'number' }],
        sampleRows: [{ 销售额: 100 }],
      },
    })
    expect(datasetResponse.statusCode).toBe(200)
    const datasetId = datasetResponse.json<{ dataset: { id: string } }>().dataset.id

    const projectResponse = await app.inject({
      method: 'POST',
      url: '/api/projects',
      headers: { authorization: authHeader },
      payload: {
        name: 'Sales Project',
        datasetId,
        dashboard: { charts: [] },
        filters: [],
      },
    })
    expect(projectResponse.statusCode).toBe(200)
    const projectId = projectResponse.json<{ project: { id: string } }>().project.id

    const aiResponse = await app.inject({
      method: 'POST',
      url: '/api/ai/analyze',
      headers: { authorization: authHeader },
      payload: {
        projectId,
        datasetSummary: { rowCount: 2 },
        dashboardSummary: { charts: [] },
        analysisType: 'summary',
      },
    })
    expect(aiResponse.statusCode).toBe(200)
    expect(aiResponse.json<{ report: { content: string } }>().report.content).toContain('核心发现')

    const usageResponse = await app.inject({
      method: 'GET',
      url: '/api/billing/usage',
      headers: { authorization: authHeader },
    })
    expect(usageResponse.statusCode).toBe(200)
    expect(usageResponse.json<{ usage: { aiUsedToday: number } }>().usage.aiUsedToday).toBe(1)
  })
})
