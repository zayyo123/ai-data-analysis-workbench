import { prisma } from '../../prisma.js'
import type { AuthUser } from '../../auth.js'
import { assertCanCreateProject } from '../billing/billing.service.js'
import type { CreateProjectInput, UpdateProjectInput } from './projects.schema.js'

export async function createProject(user: AuthUser, input: CreateProjectInput) {
  const dataset = await prisma.dataset.findFirst({
    where: { id: input.datasetId, userId: user.id },
  })
  if (!dataset) throw new Error('数据集不存在')

  await assertCanCreateProject(user)

  return prisma.project.create({
    data: {
      userId: user.id,
      datasetId: input.datasetId,
      name: input.name,
      dashboardJson: JSON.stringify(input.dashboard),
      filtersJson: JSON.stringify(input.filters),
    },
  })
}

export async function listProjects(user: AuthUser) {
  return prisma.project.findMany({
    where: { userId: user.id },
    include: { dataset: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getProject(user: AuthUser, projectId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: { dataset: true, aiReports: { orderBy: { createdAt: 'desc' } } },
  })
}

export async function updateProject(user: AuthUser, projectId: string, input: UpdateProjectInput) {
  const existing = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  })
  if (!existing) throw new Error('项目不存在')

  return prisma.project.update({
    where: { id: projectId },
    data: {
      name: input.name ?? existing.name,
      dashboardJson: input.dashboard === undefined ? existing.dashboardJson : JSON.stringify(input.dashboard),
      filtersJson: input.filters === undefined ? existing.filtersJson : JSON.stringify(input.filters),
    },
  })
}

export async function deleteProject(user: AuthUser, projectId: string) {
  return prisma.project.deleteMany({
    where: { id: projectId, userId: user.id },
  })
}

export function serializeProject(project: {
  id: string
  userId: string
  datasetId: string
  name: string
  dashboardJson: string
  filtersJson: string
  createdAt: Date
  updatedAt: Date
  dataset?: unknown
  aiReports?: unknown[]
}) {
  return {
    ...project,
    dashboard: JSON.parse(project.dashboardJson) as unknown,
    filters: JSON.parse(project.filtersJson) as unknown[],
    dashboardJson: undefined,
    filtersJson: undefined,
  }
}
