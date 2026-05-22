import path from 'node:path'
import { expect, test } from '@playwright/test'

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

test('用户仍然可以通过本地 CSV 文件完成分析链路', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('file-input').setInputFiles(path.resolve('examples/sales.csv'))

  await expect(page.getByText('字段列表')).toBeVisible()
  await expect(page.getByText('图表推荐')).toBeVisible()
})
