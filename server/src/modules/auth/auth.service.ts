import { prisma } from '../../prisma.js'
import { hashPassword, verifyPassword } from '../../utils/password.js'
import type { LoginInput, RegisterInput } from './auth.schema.js'

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (existingUser) {
    throw new Error('该邮箱已注册')
  }

  return prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash: await hashPassword(input.password),
    },
  })
}

export async function validateLogin(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (!user) {
    throw new Error('邮箱或密码错误')
  }

  const passwordMatched = await verifyPassword(input.password, user.passwordHash)
  if (!passwordMatched) {
    throw new Error('邮箱或密码错误')
  }

  return user
}

export function toPublicUser(user: { id: string; email: string; name: string | null; plan: string }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan as 'FREE' | 'PRO' | 'TEAM',
  }
}
