import type { FastifyReply } from 'fastify'

export function sendError(reply: FastifyReply, statusCode: number, message: string, code = 'BAD_REQUEST'): FastifyReply {
  return reply.status(statusCode).send({
    error: {
      code,
      message,
    },
  })
}
