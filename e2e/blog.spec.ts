import { test, expect } from '@playwright/test'

test.describe('ZenithSpace · blog', () => {
  test('la portada carga con el hero y la entrada destacada', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Investigaciones')
    await expect(page.getByText('ZenithSpace · cuaderno de Redes')).toBeVisible()
    const tituloDestacada = page.getByRole('heading', { name: /WiMAX: la promesa inalámbrica/ }).first()
    await tituloDestacada.scrollIntoViewIfNeeded()
    await expect(tituloDestacada).toBeVisible()
  })

  test('la entrada de WiMAX se abre por enlace directo con su índice y sus secciones', async ({ page }) => {
    await page.goto('/#/entrada/red-wimax')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('WiMAX')
    const enlacesIndice = page.locator('nav[aria-label="Índice de la entrada"] a, nav[aria-label="Índice de secciones"] a')
    expect(await enlacesIndice.count()).toBeGreaterThan(10)
    for (const seccion of ['que-es', 'comparativa', 'linea', 'laboratorio', 'bolivia', 'modelo', 'glosario', 'fuentes']) {
      await expect(page.locator('#' + seccion)).toHaveCount(1)
    }
  })

  test('el laboratorio recalcula el radio de Fresnel al mover un control', async ({ page }) => {
    await page.goto('/#/entrada/red-wimax')
    const laboratorio = page.locator('#laboratorio')
    await laboratorio.scrollIntoViewIfNeeded()
    const primeraMedida = await laboratorio.getByText(/^\d+\.\d{2} m$/).first().innerText()
    await laboratorio.getByLabel('Distancia a la torre (d₁)').fill('4000')
    await expect(laboratorio.getByText(/^\d+\.\d{2} m$/).first()).not.toHaveText(primeraMedida)
    await expect(laboratorio.getByText(/r = \d+\.\d{2} m/)).toBeVisible()
  })

  test('el glosario filtra términos en vivo', async ({ page }) => {
    await page.goto('/#/entrada/red-wimax')
    const glosario = page.locator('#glosario')
    await glosario.scrollIntoViewIfNeeded()
    const lista = glosario.locator('dl')
    await glosario.getByRole('searchbox').fill('fresnel')
    await expect(lista.getByText('Zona de Fresnel')).toBeVisible()
    await expect(lista.getByText('AeroMACS')).toHaveCount(0)
    await glosario.getByRole('searchbox').fill('aeromacs')
    await expect(lista.getByText('AeroMACS')).toBeVisible()
    await expect(lista.getByText('Zona de Fresnel')).toHaveCount(0)
  })

  test('el informe completo se renderiza desde el markdown', async ({ page }) => {
    await page.goto('/#/informe')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('informe')
    await expect(page.locator('article')).toContainText('WiMAX', { timeout: 20_000 })
    await expect(page.getByRole('link', { name: /Descargar/ })).toHaveAttribute('href', /red-wimax\.md/)
  })

  test('una ruta inexistente muestra la página de señal perdida', async ({ page }) => {
    await page.goto('/#/no-existe-esta-ruta')
    await expect(page.getByRole('heading', { name: /Se perdió la señal/ })).toBeVisible()
    await page.getByRole('button', { name: /Ir al inicio/ }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Investigaciones')
  })

  test('el enlace de la entrada "Sobre mí" abre la página personal', async ({ page }) => {
    await page.goto('/#/entrada/sobre-mi')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Sobre mí')
    await expect(page.getByText('Calle Cucho Josué Salomón').first()).toBeVisible()
  })
})
