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

export async function deleteProjectReport(user: AuthUser, reportId: string) {
  // 删除报告必须同时校验 userId，避免只凭 reportId 删除其他用户的历史分析结论。
  return prisma.aiReport.deleteMany({
    where: { id: reportId, userId: user.id },
  })
}
