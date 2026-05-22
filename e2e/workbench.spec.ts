import path from 'node:path'
import { expect, test } from '@playwright/test'

test('用户可以上传 CSV、添加推荐图表并生成 Mock AI 分析', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('file-input').setInputFiles(path.resolve('examples/sales.csv'))

  await expect(page.getByText('字段列表')).toBeVisible()
  await expect(page.getByText('数据预览')).toBeVisible()

  await page.getByRole('button', { name: '添加到看板' }).first().click()
  await expect(page.getByTestId('dashboard-chart-card')).toBeVisible()

  await page.getByRole('button', { name: '生成 AI 分析' }).click()
  await expect(page.getByText('数据概览')).toBeVisible({ timeout: 10_000 })
})
