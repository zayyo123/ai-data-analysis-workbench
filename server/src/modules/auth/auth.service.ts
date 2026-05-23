import { prisma } from '../../prisma.js'
import { hashPassword, verifyPassword } from '../../utils/password.js'
import type { ChangePasswordInput, LoginInput, RegisterInput, UpdateProfileInput } from './auth.schema.js'

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

export async function updateUserProfile(userId: string, input: UpdateProfileInput) {
  return prisma.user.update({
    where: { id: userId },
    data: { name: input.name },
  })
}

export async function changeUserPassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error('用户不存在')
  }

  const passwordMatched = await verifyPassword(input.currentPassword, user.passwordHash)
  if (!passwordMatched) {
    throw new Error('当前密码不正确')
  }

  // 密码只保存哈希值，接口层不会回传任何密码相关字段。
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(input.newPassword) },
  })
}

export function toPublicUser(user: { id: string; email: string; name: string | null; plan: string }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan as 'FREE' | 'PRO' | 'TEAM',
  }
}
