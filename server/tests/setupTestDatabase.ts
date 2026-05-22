import { prisma } from '../src/prisma.js'

/**
 * 当前 Windows 中文路径下 Prisma schema engine 执行 db push 会返回空错误。
 * 测试环境用显式 SQL 创建最小表结构，既保留 Prisma Client 调用链路，
 * 又避免把本地环境问题扩散到 API 测试。
 */
export async function resetTestDatabase(): Promise<void> {
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF')

  await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "UsageLog"')
  await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "AiReport"')
  await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "Project"')
  await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "Dataset"')
  await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "User"')

  await prisma.$executeRawUnsafe(`
    CREATE TABLE "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "passwordHash" TEXT NOT NULL,
      "name" TEXT,
      "plan" TEXT NOT NULL DEFAULT 'FREE',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE "Dataset" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "fileName" TEXT NOT NULL,
      "fileType" TEXT NOT NULL,
      "rowCount" INTEGER NOT NULL,
      "fieldCount" INTEGER NOT NULL,
      "fieldsJson" TEXT NOT NULL,
      "sampleJson" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Dataset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE "Project" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "datasetId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "dashboardJson" TEXT NOT NULL,
      "filtersJson" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
      CONSTRAINT "Project_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset" ("id") ON DELETE CASCADE
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE "AiReport" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "projectId" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "promptTitle" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "tokenUsage" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "AiReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
      CONSTRAINT "AiReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE "UsageLog" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "action" TEXT NOT NULL,
      "amount" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "UsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
    )
  `)

  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON')
}
