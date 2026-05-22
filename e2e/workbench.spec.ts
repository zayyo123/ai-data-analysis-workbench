import path from 'node:path'
import { expect, test } from '@playwright/test'

test('登录页可以一键填入演示账号', async ({ page }) => {
  await page.goto('/login')

  await expect(page.getByText('演示账号', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '填入演示账号' }).click()

  await expect(page.getByLabel('邮箱')).toHaveValue('demo@example.com')
  await expect(page.getByLabel('密码')).toHaveValue('password123')
})

test('用户可以上传 CSV、添加推荐图表并生成 Mock AI 分析', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /销售经营分析/ }).click()

  await expect(page.getByText('字段列表')).toBeVisible()
  await expect(page.getByText('数据预览')).toBeVisible()

  await page.getByRole('button', { name: '添加到看板' }).first().click()
  await expect(page.getByTestId('dashboard-chart-card')).toBeVisible()
  await expect(page.getByText('图表配置')).toBeVisible()

  await page.getByTestId('dashboard-chart-card').first().click()
  await page.getByLabel('图表标题').fill('地区销售表现')
  await expect(page.getByText('地区销售表现')).toBeVisible()

  await page.getByRole('button', { name: '生成 AI 分析' }).click()
  await expect(page.getByText('数据概览')).toBeVisible({ timeout: 10_000 })
})

test('用户可以删除本地最近项目', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /销售经营分析/ }).click()
  await expect(page.getByText('字段列表')).toBeVisible()

  await page.getByRole('button', { name: '返回首页' }).click()
  await expect(page.getByText('最近项目')).toBeVisible()
  await expect(page.locator('.project-list').getByRole('button', { name: /销售经营分析/ })).toBeVisible()

  await page.getByRole('button', { name: '删除' }).first().click()
  await page.getByRole('button', { name: '删除' }).last().click()

  await expect(page.getByText('项目已删除')).toBeVisible()
  await expect(page.getByText('上传数据后会自动创建项目')).toBeVisible()
})

test('用户仍然可以通过本地 CSV 文件完成分析链路', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('file-input').setInputFiles(path.resolve('examples/sales.csv'))

  await expect(page.getByText('字段列表')).toBeVisible()
  await expect(page.getByText('图表推荐')).toBeVisible()
})
