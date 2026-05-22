import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.fullstack\.spec\.ts/,
  timeout: 45_000,
  use: {
    baseURL: 'http://127.0.0.1:4176',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'cd server && npm run e2e:db && npm run e2e:dev',
      url: 'http://127.0.0.1:4100/api/health',
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: 'npm run build && npm run preview -- --port 4176',
      url: 'http://127.0.0.1:4176',
      reuseExistingServer: false,
      timeout: 90_000,
      env: {
        VITE_API_BASE_URL: 'http://127.0.0.1:4100/api',
      },
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.CI ? {} : { channel: 'chrome' }),
      },
    },
  ],
})
