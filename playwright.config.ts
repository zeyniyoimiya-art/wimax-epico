import { defineConfig, devices } from '@playwright/test'

/** Pruebas de extremo a extremo contra la versión compilada del blog. */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    screenshot: 'only-on-failure',
    trace: 'off'
  },
  projects: [
    // Edge es Chromium: se usa el navegador ya instalado en el sistema para no
    // depender de la descarga de `npx playwright install chromium`.
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], channel: 'msedge' } },
    { name: 'movil', use: { ...devices['Pixel 7'], channel: 'msedge' } }
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    timeout: 240_000,
    reuseExistingServer: true,
    stdout: 'ignore',
    stderr: 'pipe'
  }
})
