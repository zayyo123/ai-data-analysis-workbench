import type { FastifyInstance, FastifyReply } from 'fastify'
import { prisma } from '../../prisma.js'

const SERVICE_NAME = 'ai-data-analysis-workbench-server'

interface HealthCheck {
  name: 'database'
  status: 'ok' | 'error'
  latencyMs?: number
  message?: string
}

interface HealthPayload {
  status: 'ok' | 'error'
  service: string
  uptimeSeconds: number
  checkedAt: string
  checks: HealthCheck[]
}

export async function healthRoutes(app: FastifyInstance) {
  app.get('/live', async () => ({
    status: 'ok',
    service: SERVICE_NAME,
    uptimeSeconds: Math.round(process.uptime()),
    checkedAt: new Date().toISOString(),
  }))

  app.get('/health', async (_request, reply) => sendHealth(reply))
  app.get('/ready', async (_request, reply) => sendHealth(reply))
}

async function sendHealth(reply: FastifyReply): Promise<FastifyReply> {
  const checks = [await checkDatabase()]
  const isHealthy = checks.every((check) => check.status === 'ok')
  const payload: HealthPayload = {
    status: isHealthy ? 'ok' : 'error',
    service: SERVICE_NAME,
    uptimeSeconds: Math.round(process.uptime()),
    checkedAt: new Date().toISOString(),
    checks,
  }

  return reply.status(isHealthy ? 200 : 503).send(payload)
}

async function checkDatabase(): Promise<HealthCheck> {
  const startedAt = performance.now()

  try {
    // 健康检查只执行最轻量的 SELECT，验证 Prisma 到 SQLite 的真实读写链路是否可用。
    await prisma.$queryRaw`SELECT 1`
    return {
      name: 'database',
      status: 'ok',
      latencyMs: Math.round(performance.now() - startedAt),
    }
  } catch (error) {
    return {
      name: 'database',
      status: 'error',
      latencyMs: Math.round(performance.now() - startedAt),
      message: error instanceof Error ? error.message : '数据库连接失败',
    }
  }
}
