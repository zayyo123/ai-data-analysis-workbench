import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import Fastify from 'fastify'
import { env, corsOrigins } from './config/env.js'
import { aiRoutes } from './modules/ai/ai.routes.js'
import { authRoutes } from './modules/auth/auth.routes.js'
import { billingRoutes } from './modules/billing/billing.routes.js'
import { datasetRoutes } from './modules/datasets/datasets.routes.js'
import { healthRoutes } from './modules/health/health.routes.js'
import { projectRoutes } from './modules/projects/projects.routes.js'
import { reportRoutes } from './modules/reports/reports.routes.js'

export function buildApp() {
  const app = Fastify({
    logger: true,
  })

  void app.register(cors, {
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Not allowed by CORS'), false)
    },
  })

  void app.register(jwt, {
    secret: env.JWT_SECRET,
  })

  void app.register(healthRoutes, { prefix: '/api' })
  void app.register(authRoutes, { prefix: '/api/auth' })
  void app.register(datasetRoutes, { prefix: '/api/datasets' })
  void app.register(projectRoutes, { prefix: '/api/projects' })
  void app.register(aiRoutes, { prefix: '/api/ai' })
  void app.register(reportRoutes, { prefix: '/api/reports' })
  void app.register(billingRoutes, { prefix: '/api/billing' })

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error)
    reply.status(500).send({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '服务暂时不可用，请稍后重试',
      },
    })
  })

  return app
}
