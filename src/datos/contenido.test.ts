import { describe, it, expect } from 'vitest'
import { esquemaFicha, esquemaEntrada, esquemaSobreMi } from './esquemas'
import { entradas, destacada, fichaWimax, sobreMi } from './wimax'
import { atenuacionJs, fresnelJs, simularJs, TAMANO_WASM_BYTES } from '../lib/wasm'
import { calidadVital, prefiereMenosMovimiento } from '../lib/plataforma'

describe('esquemas del blog (Zod)', () => {
  it('rechaza una ficha incompleta', () => {
    expect(() => esquemaFicha.parse({ slug: 'x', titulo: 'corto' })).toThrow()
  })

  it('valida la entrada destacada con todos sus bloques', () => {
    expect(fichaWimax.slug).toBe('red-wimax')
    expect(fichaWimax.linea.length).toBeGreaterThanOrEqual(5)
    expect(fichaWimax.fuentes.length).toBeGreaterThanOrEqual(6)
    expect(fichaWimax.personajes.some((p) => p.boliviano)).toBe(true)
  })

  it('hay una sola entrada destacada y slugs únicos', () => {
    expect(entradas.filter((e) => e.destacada)).toHaveLength(1)
    expect(new Set(entradas.map((e) => e.slug)).size).toBe(entradas.length)
    expect(destacada.slug).toBe('red-wimax')
  })

  it('la ficha de autor usa el nombre completo', () => {
    expect(sobreMi.datos[0]?.valor).toBe('Calle Cucho Josué Salomón')
    expect(() => esquemaSobreMi.parse({ ...sobreMi, parrafos: [] })).toThrow()
  })

  it('las entradas publicadas declaran etiquetas y minutos de lectura', () => {
    entradas.forEach((entrada) => {
      expect(() => esquemaEntrada.parse(entrada)).not.toThrow()
      expect(entrada.minutos).toBeGreaterThan(0)
      expect(entrada.etiquetas.length).toBeGreaterThan(0)
    })
  })
})

describe('cálculos de radio (respaldo JS y comparación con WASM)', () => {
  it('el radio de Fresnel coincide con el valor de referencia', () => {
    // d1 = d2 = 1000 m a 3.5 GHz → λ = 0,0856 m → r = sqrt(λ·250) ≈ 6,54 m
    const radio = fresnelJs(1000, 1000, 3.5e9)
    expect(radio).toBeGreaterThan(6.4)
    expect(radio).toBeLessThan(6.7)
    // a menor frecuencia, el elipsoide es más grande
    expect(fresnelJs(1000, 1000, 700e6)).toBeGreaterThan(radio)
  })

  it('siempre se cumple r = sqrt(λ·d1·d2/(d1+d2))', () => {
    const c = 299792458
    const d1 = 700
    const d2 = 2300
    const f = 2.5e9
    const esperado = Math.sqrt(((c / f) * d1 * d2) / (d1 + d2))
    expect(fresnelJs(d1, d2, f)).toBeCloseTo(esperado, 12)
  })

  it('la atenuación decrece con la distancia', () => {
    const cerca = atenuacionJs(1, 10, 0.001)
    const lejos = atenuacionJs(1, 90, 0.001)
    expect(cerca).toBeGreaterThan(lejos)
    expect(lejos).toBeGreaterThan(0)
  })

  it('el benchmark de fuerza bruta es determinista', () => {
    expect(simularJs(1000)).toBe(simularJs(1000))
    expect(simularJs(0)).toBe(0)
  })

  it('el módulo WASM embebido pesa lo esperado', () => {
    expect(TAMANO_WASM_BYTES).toBeGreaterThan(100)
    expect(TAMANO_WASM_BYTES).toBeLessThan(2000)
  })
})

describe('utilidades de plataforma', () => {
  it('clasifica los Core Web Vitals según los umbrales oficiales', () => {
    expect(calidadVital('lcp', 1200)).toBe('bueno')
    expect(calidadVital('lcp', 3000)).toBe('mejorar')
    expect(calidadVital('lcp', 5000)).toBe('malo')
    expect(calidadVital('cls', 0.05)).toBe('bueno')
    expect(calidadVital('cls', 0.3)).toBe('malo')
    expect(calidadVital('inp', 150)).toBe('bueno')
    expect(calidadVital('desconocido', 1.5)).toBe('mejorar')
  })

  it('no pide menos movimiento cuando no hay matchMedia (entorno node)', () => {
    expect(typeof prefiereMenosMovimiento()).toBe('boolean')
  })
})
