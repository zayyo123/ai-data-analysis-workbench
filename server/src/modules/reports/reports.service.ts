import { prisma } from '../../prisma.js'
import type { AuthUser } from '../../auth.js'

export async function listProjectReports(user: AuthUser, projectId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  })
  if (!project) throw new Error('项目不存在')

  return prisma.aiReport.findMany({
    where: { userId: user.id, projectId },
    orderBy: { createdAt: 'desc' },
  })
}
