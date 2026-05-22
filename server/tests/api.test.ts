import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { buildApp } from '../src/app.js'
import { prisma } from '../src/prisma.js'
import { resetTestDatabase } from './setupTestDatabase.js'

const app = buildApp()

beforeAll(async () => {
  await resetTestDatabase()
})

afterAll(async () => {
  await app.close()
  await prisma.$disconnect()
})

describe('full-stack API MVP', () => {
  it('reports liveness and database readiness', async () => {
    const liveResponse = await app.inject({
      method: 'GET',
      url: '/api/live',
    })
    expect(liveResponse.statusCode).toBe(200)
    expect(liveResponse.headers['x-content-type-options']).toBe('nosniff')
    expect(liveResponse.headers['x-frame-options']).toBe('DENY')
    expect(liveResponse.json<{ status: string; service: string } >()).toMatchObject({
      status: 'ok',
      service: 'ai-data-analysis-workbench-server',
    })

    const readyResponse = await app.inject({
      method: 'GET',
      url: '/api/ready',
    })
    expect(readyResponse.statusCode).toBe(200)
    expect(readyResponse.json<{ status: string; checks: Array<{ name: string; status: string }> } >()).toMatchObject({
      status: 'ok',
      checks: [{ name: 'database', status: 'ok' }],
    })
  })

  it('lists commercial billing plans', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/billing/plans',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json<{ plans: Array<{ id: string; priceMonthly: number }> }>().plans).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'FREE', priceMonthly: 0 }),
        expect.objectContaining({ id: 'PRO', priceMonthly: 29 }),
        expect.objectContaining({ id: 'TEAM', priceMonthly: 99 }),
      ]),
    )
  })

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
    const tokenPayload = decodeJwtPayload<{ exp?: number }>(registerBody.token)
    expect(tokenPayload.exp).toBeTypeOf('number')
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

    const datasetDetailResponse = await app.inject({
      method: 'GET',
      url: `/api/datasets/${datasetId}`,
      headers: { authorization: authHeader },
    })
    expect(datasetDetailResponse.statusCode).toBe(200)
    expect(datasetDetailResponse.json<{ dataset: { sampleRows: unknown[] } }>().dataset.sampleRows).toHaveLength(1)

    const projectDetailResponse = await app.inject({
      method: 'GET',
      url: `/api/projects/${projectId}`,
      headers: { authorization: authHeader },
    })
    expect(projectDetailResponse.statusCode).toBe(200)
    expect(projectDetailResponse.json<{ project: { dashboard: { charts: unknown[] } } }>().project.dashboard.charts).toEqual([])

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

    const reportsResponse = await app.inject({
      method: 'GET',
      url: `/api/reports/${projectId}`,
      headers: { authorization: authHeader },
    })
    expect(reportsResponse.statusCode).toBe(200)
    expect(reportsResponse.json<{ reports: unknown[] }>().reports).toHaveLength(1)

    const usageResponse = await app.inject({
      method: 'GET',
      url: '/api/billing/usage',
      headers: { authorization: authHeader },
    })
    expect(usageResponse.statusCode).toBe(200)
    expect(usageResponse.json<{ usage: { aiUsedToday: number } }>().usage.aiUsedToday).toBe(1)

    const deleteProjectResponse = await app.inject({
      method: 'DELETE',
      url: `/api/projects/${projectId}`,
      headers: { authorization: authHeader },
    })
    expect(deleteProjectResponse.statusCode).toBe(200)
    expect(deleteProjectResponse.json<{ ok: boolean }>().ok).toBe(true)

    const deletedProjectResponse = await app.inject({
      method: 'GET',
      url: `/api/projects/${projectId}`,
      headers: { authorization: authHeader },
    })
    expect(deletedProjectResponse.statusCode).toBe(404)
  })

  it('blocks free users after the daily AI analysis quota is exhausted', async () => {
    const registerResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'quota@example.com',
        password: 'password123',
        name: 'Quota Tester',
      },
    })
    expect(registerResponse.statusCode).toBe(200)
    const authHeader = `Bearer ${registerResponse.json<{ token: string }>().token}`

    const datasetResponse = await app.inject({
      method: 'POST',
      url: '/api/datasets',
      headers: { authorization: authHeader },
      payload: {
        name: 'Quota Sales',
        fileName: 'quota-sales.csv',
        fileType: 'csv',
        rowCount: 2,
        fields: [{ name: 'revenue', type: 'number' }],
        sampleRows: [{ revenue: 100 }],
      },
    })
    expect(datasetResponse.statusCode).toBe(200)
    const datasetId = datasetResponse.json<{ dataset: { id: string } }>().dataset.id

    const projectResponse = await app.inject({
      method: 'POST',
      url: '/api/projects',
      headers: { authorization: authHeader },
      payload: {
        name: 'Quota Project',
        datasetId,
        dashboard: { charts: [] },
        filters: [],
      },
    })
    expect(projectResponse.statusCode).toBe(200)
    const projectId = projectResponse.json<{ project: { id: string } }>().project.id

    const payload = {
      projectId,
      datasetSummary: { rowCount: 2 },
      dashboardSummary: { charts: [] },
      analysisType: 'summary',
    }

    // 免费版每天允许 5 次 AI 分析；接口层必须兜住限制，不能只依赖前端提示。
    for (let index = 0; index < 5; index += 1) {
      const response = await app.inject({
        method: 'POST',
        url: '/api/ai/analyze',
        headers: { authorization: authHeader },
        payload,
      })
      expect(response.statusCode).toBe(200)
    }

    const blockedResponse = await app.inject({
      method: 'POST',
      url: '/api/ai/analyze',
      headers: { authorization: authHeader },
      payload,
    })
    expect(blockedResponse.statusCode).toBe(429)
    expect(blockedResponse.json<{ error: { code: string; message: string } }>().error).toMatchObject({
      code: 'USAGE_LIMIT_EXCEEDED',
    })

    const usageResponse = await app.inject({
      method: 'GET',
      url: '/api/billing/usage',
      headers: { authorization: authHeader },
    })
    expect(usageResponse.statusCode).toBe(200)
    expect(usageResponse.json<{ usage: { aiUsedToday: number } }>().usage.aiUsedToday).toBe(5)

    const upgradeResponse = await app.inject({
      method: 'POST',
      url: '/api/billing/upgrade',
      headers: { authorization: authHeader },
      payload: { plan: 'PRO' },
    })
    expect(upgradeResponse.statusCode).toBe(200)
    const upgradedBody = upgradeResponse.json<{
      token: string
      user: { plan: string }
      usage: { plan: string; aiDailyLimit: number | null }
    }>()
    expect(upgradedBody.user.plan).toBe('PRO')
    expect(upgradedBody.usage).toMatchObject({
      plan: 'PRO',
      aiDailyLimit: null,
    })

    const upgradedAuthHeader = `Bearer ${upgradedBody.token}`
    const aiAfterUpgradeResponse = await app.inject({
      method: 'POST',
      url: '/api/ai/analyze',
      headers: { authorization: upgradedAuthHeader },
      payload,
    })
    expect(aiAfterUpgradeResponse.statusCode).toBe(200)
  })

  it('enforces free project quota and unlocks it after upgrading', async () => {
    const registerResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'project-limit@example.com',
        password: 'password123',
        name: 'Project Limit Tester',
      },
    })
    expect(registerResponse.statusCode).toBe(200)
    const authHeader = `Bearer ${registerResponse.json<{ token: string }>().token}`

    const datasetResponse = await app.inject({
      method: 'POST',
      url: '/api/datasets',
      headers: { authorization: authHeader },
      payload: {
        name: 'Project Limit Dataset',
        fileName: 'project-limit.csv',
        fileType: 'csv',
        rowCount: 1,
        fields: [{ name: 'revenue', type: 'number' }],
        sampleRows: [{ revenue: 100 }],
      },
    })
    expect(datasetResponse.statusCode).toBe(200)
    const datasetId = datasetResponse.json<{ dataset: { id: string } }>().dataset.id

    // 免费版最多保存 10 个云端项目；接口必须按真实项目数执行限制，避免只做前端提示。
    for (let index = 0; index < 10; index += 1) {
      const response = await app.inject({
        method: 'POST',
        url: '/api/projects',
        headers: { authorization: authHeader },
        payload: {
          name: `Project ${index + 1}`,
          datasetId,
          dashboard: { charts: [] },
          filters: [],
        },
      })
      expect(response.statusCode).toBe(200)
    }

    const usageResponse = await app.inject({
      method: 'GET',
      url: '/api/billing/usage',
      headers: { authorization: authHeader },
    })
    expect(usageResponse.statusCode).toBe(200)
    expect(usageResponse.json<{ usage: { projectCount: number; projectLimit: number | null } }>().usage).toMatchObject({
      projectCount: 10,
      projectLimit: 10,
    })

    const blockedResponse = await app.inject({
      method: 'POST',
      url: '/api/projects',
      headers: { authorization: authHeader },
      payload: {
        name: 'Project 11',
        datasetId,
        dashboard: { charts: [] },
        filters: [],
      },
    })
    expect(blockedResponse.statusCode).toBe(429)
    expect(blockedResponse.json<{ error: { code: string } }>().error.code).toBe('PROJECT_LIMIT_EXCEEDED')

    const upgradeResponse = await app.inject({
      method: 'POST',
      url: '/api/billing/upgrade',
      headers: { authorization: authHeader },
      payload: { plan: 'PRO' },
    })
    expect(upgradeResponse.statusCode).toBe(200)
    const upgradedBody = upgradeResponse.json<{
      token: string
      usage: { plan: string; projectCount: number; projectLimit: number | null }
    }>()
    expect(upgradedBody.usage).toMatchObject({
      plan: 'PRO',
      projectCount: 10,
      projectLimit: null,
    })

    const createAfterUpgradeResponse = await app.inject({
      method: 'POST',
      url: '/api/projects',
      headers: { authorization: `Bearer ${upgradedBody.token}` },
      payload: {
        name: 'Project 11',
        datasetId,
        dashboard: { charts: [] },
        filters: [],
      },
    })
    expect(createAfterUpgradeResponse.statusCode).toBe(200)
  })

  it('rate limits repeated auth attempts from the same client', async () => {
    const headers = { 'x-forwarded-for': '203.0.113.10' }

    for (let index = 0; index < 20; index += 1) {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        headers,
        payload: {
          email: 'missing@example.com',
          password: 'password123',
        },
      })
      expect(response.statusCode).toBe(401)
    }

    const blockedResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      headers,
      payload: {
        email: 'missing@example.com',
        password: 'password123',
      },
    })
    expect(blockedResponse.statusCode).toBe(429)
    expect(blockedResponse.headers['retry-after']).toBeDefined()
    expect(blockedResponse.json<{ error: { code: string } }>().error.code).toBe('RATE_LIMITED')
  })
})

function decodeJwtPayload<TPayload>(token: string): TPayload {
  const [, payload] = token.split('.')
  if (!payload) throw new Error('JWT payload is missing')
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TPayload
}
