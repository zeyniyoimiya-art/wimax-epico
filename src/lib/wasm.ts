import { WASM_BASE64 } from './wasm-base64'

/** Exportaciones del módulo WebAssembly escrito a mano (scripts/construir_wasm.mjs). */
export type ExportacionesWasm = {
  /** Zona de Fresnel [m]: d1, d2 en metros · f en Hz */
  fresnel: (d1: number, d2: number, f: number) => number
  /** Potencia recibida normalizada: pr / (1 + alpha·d²) */
  atenuacion: (pr: number, dist: number, alpha: number) => number
  /** Suma de raíces (benchmark de fuerza bruta) */
  simular: (iteraciones: number) => number
}

export const TAMANO_WASM_BYTES = Math.floor((WASM_BASE64.length * 3) / 4)

/* ── Implementaciones en JavaScript (respaldo y comparación de resultados) ── */
export function fresnelJs(d1: number, d2: number, f: number): number {
  const c = 299792458
  return Math.sqrt((c * d1 * d2) / ((d1 + d2) * f))
}

export function atenuacionJs(pr: number, dist: number, alpha: number): number {
  return pr / (1 + alpha * dist * dist)
}

export function simularJs(iteraciones: number): number {
  let suma = 0
  for (let i = 0; i < iteraciones; i++) suma += Math.sqrt(i)
  return suma
}

function base64ABytes(b64: string): Uint8Array {
  const binario = atob(b64)
  const bytes = new Uint8Array(binario.length)
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i)
  return bytes
}

let enCurso: Promise<ExportacionesWasm | null> | null = null

/** Instancia el módulo WASM una sola vez. Si algo falla devuelve null y la app usa JS. */
export function cargarWasm(): Promise<ExportacionesWasm | null> {
  if (!enCurso) {
    enCurso = (async () => {
      if (typeof WebAssembly === 'undefined') return null
      try {
        const { instance } = (await WebAssembly.instantiate(base64ABytes(WASM_BASE64), {})) as unknown as WebAssembly.WebAssemblyInstantiatedSource
        const exp = instance.exports as unknown as ExportacionesWasm
        if (typeof exp.fresnel !== 'function' || typeof exp.simular !== 'function') return null
        return exp
      } catch {
        return null
      }
    })()
  }
  return enCurso
}

export type Medida = { ms: number; resultado: number }

function medir(fn: (n: number) => number, iteraciones: number): Medida {
  const t0 = performance.now()
  const resultado = fn(iteraciones)
  return { ms: performance.now() - t0, resultado }
}

/** Corre el mismo cálculo en JS y en WASM para comparar tiempo y resultado. */
export async function compararMotores(iteraciones = 1_500_000): Promise<{ wasm: Medida; js: Medida; usado: 'wasm' | 'js' }> {
  const exp = await cargarWasm()
  const js = medir(simularJs, iteraciones)
  if (!exp) return { wasm: { ms: 0, resultado: 0 }, js, usado: 'js' }
  const wasm = medir(exp.simular, iteraciones)
  return { wasm, js, usado: 'wasm' }
}
