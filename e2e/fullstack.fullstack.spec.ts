import { expect, test } from '@playwright/test'

test('登录用户可以保存云端项目、生成报告并读回用量', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`

  await page.goto('/register')
  await page.getByLabel('姓名').fill('E2E User')
  await page.getByLabel('邮箱').fill(email)
  await page.getByLabel('密码').fill('password123')
  await page.getByRole('button', { name: '注册并进入' }).click()

  await expect(page.getByText(email)).toBeVisible()
  await expect(page.getByText(/FREE 套餐/)).toBeVisible()

  await page.goto('/login')
  await expect(page).toHaveURL('/')
  await expect(page.getByText(email)).toBeVisible()
  await page.goto('/register')
  await expect(page).toHaveURL('/')
  await expect(page.getByText(email)).toBeVisible()

  await page.getByRole('button', { name: /销售经营分析/ }).click()
  await expect(page.getByText('字段列表')).toBeVisible()
  await expect(page.getByText('套餐与用量')).toBeVisible()

  await page.getByRole('button', { name: '添加到看板' }).first().click()
  await expect(page.getByTestId('dashboard-chart-card')).toBeVisible()

  await page.getByRole('button', { name: '生成 AI 分析' }).click()
  await expect(page.getByText('核心发现')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText('1/5')).toBeVisible()
  await expect(page.getByText('今日 AI 分析额度')).toBeVisible()
  await expect(page.getByText('已保存报告')).toBeVisible()

  await page.getByRole('button', { name: '升级 Pro' }).click()
  await expect(page.getByText('已升级到 PRO 套餐')).toBeVisible()
  await expect(page.locator('.el-tag__content').filter({ hasText: /^PRO$/ })).toBeVisible()
  await expect(page.getByText('不限次').first()).toBeVisible()
  await expect(page.getByRole('button', { name: '当前套餐' })).toBeDisabled()

  await page.getByRole('button', { name: '返回首页' }).click()
  await expect(page.getByText('最近项目')).toBeVisible()
  await page.reload()
  await expect(page.getByText(email)).toBeVisible()
  await expect(page.getByText('PRO 套餐：AI 不限次')).toBeVisible()
  await expect(page.getByText('最近项目')).toBeVisible()
  await page.getByRole('button', { name: /销售经营分析/ }).first().click()

  await expect(page.getByText('字段列表')).toBeVisible()
  await expect(page.getByTestId('dashboard-chart-card')).toBeVisible()
  await expect(page.getByText('已保存报告')).toBeVisible()
  await page.getByRole('button', { name: /AI 商业分析报告/ }).first().click()
  await expect(page.getByText('商业化价值')).toBeVisible()

  await page.getByRole('button', { name: '导出报告' }).click()
  await expect(page.getByText('字段摘要')).toBeVisible()
  await expect(page.getByText('商业化价值')).toBeVisible()
  await page.reload()
  await expect(page.getByText('字段摘要')).toBeVisible()
  await expect(page.getByText('商业化价值')).toBeVisible()
})
