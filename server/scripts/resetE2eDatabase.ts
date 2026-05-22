import { prisma } from '../src/prisma.js'
import { resetTestDatabase } from '../tests/setupTestDatabase.js'

await resetTestDatabase()
await prisma.$disconnect()
