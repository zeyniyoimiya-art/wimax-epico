/**
 * Utilidades de plataforma: WebGPU, View Transitions, Core Web Vitals, errores,
 * CSS Houdini y sonido reactivo (Web Audio API). Todo con detección de soporte
 * y respaldo silencioso: si algo no existe, la web sigue funcionando.
 */

/* ─────────── WebGPU ─────────── */
export type EstadoWebGPU = { soportado: boolean; adaptador?: string; motivo?: string }

type InfoAdaptador = { info?: { description?: string; vendor?: string; architecture?: string }; name?: string }
type GpuLike = { requestAdapter: () => Promise<unknown> }

export async function detectarWebGPU(): Promise<EstadoWebGPU> {
  try {
    const gpu = (navigator as unknown as { gpu?: GpuLike }).gpu
    if (!gpu || typeof gpu.requestAdapter !== 'function') {
      return { soportado: false, motivo: 'navigator.gpu no disponible' }
    }
    const adaptador = (await gpu.requestAdapter()) as InfoAdaptador | null
    if (!adaptador) return { soportado: false, motivo: 'sin adaptador compatible' }
    const info = adaptador.info
    const texto = info?.description ?? info?.vendor ?? adaptador.name ?? 'adaptador genérico'
    return { soportado: true, adaptador: String(texto) }
  } catch (error) {
    return { soportado: false, motivo: error instanceof Error ? error.message : 'error desconocido' }
  }
}

/* ─────────── movimiento + View Transitions ─────────── */
export function prefiereMenosMovimiento(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

type DocumentoConTransiciones = Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }

/** Corre `accion` dentro de una View Transition nativa si el navegador la soporta. */
export function conTransicion(accion: () => void): void {
  const doc = document as DocumentoConTransiciones
  if (prefiereMenosMovimiento() || typeof doc.startViewTransition !== 'function') {
    accion()
    return
  }
  doc.startViewTransition(accion)
}

/* ─────────── CSS Houdini ─────────── */
export function soportaHoudini(): boolean {
  return (
    typeof CSS !== 'undefined' &&
    typeof (CSS as unknown as { paintWorklet?: unknown }).paintWorklet !== 'undefined' &&
    CSS.supports('background-image', 'paint(ondas)')
  )
}

export async function activarPintadoHoudini(): Promise<boolean> {
  if (!soportaHoudini()) return false
  try {
    const css = CSS as unknown as { paintWorklet: { addModule: (url: string) => Promise<void> } }
    await css.paintWorklet.addModule(new URL('paint/ondas.js', document.baseURI).href)
    document.documentElement.classList.add('houdini-activo')
    return true
  } catch {
    return false
  }
}
/* ─────────── Core Web Vitals ─────────── */
export type Vitales = { lcp?: number; inp?: number; cls?: number; fcp?: number; ttfb?: number }

export async function medirVitales(alCambiar: (v: Vitales) => void): Promise<void> {
  try {
    const mod = await import('web-vitals')
    const acumulado: Vitales = {}
    const emitir = (): void => alCambiar({ ...acumulado })
    mod.onLCP((m) => {
      acumulado.lcp = m.value
      emitir()
    })
    mod.onINP((m) => {
      acumulado.inp = m.value
      emitir()
    })
    mod.onCLS((m) => {
      acumulado.cls = m.value
      emitir()
    })
    mod.onFCP((m) => {
      acumulado.fcp = m.value
      emitir()
    })
    mod.onTTFB((m) => {
      acumulado.ttfb = m.value
      emitir()
    })
  } catch {
    /* sin métricas: la web funciona igual */
  }
}

/** Calidad de un vital según los umbrales oficiales de Core Web Vitals. */
export function calidadVital(clave: string, valor: number): 'bueno' | 'mejorar' | 'malo' {
  const umbrales: Record<string, [number, number]> = {
    lcp: [2500, 4000],
    inp: [200, 500],
    cls: [0.1, 0.25],
    fcp: [1800, 3000],
    ttfb: [800, 1800]
  }
  const [bien, medio] = umbrales[clave] ?? [1, 2]
  return valor <= bien ? 'bueno' : valor <= medio ? 'mejorar' : 'malo'
}

/* ─────────── observabilidad local de errores ─────────── */
export function vigilarErrores(alReportar: (texto: string) => void): () => void {
  const enError = (ev: ErrorEvent): void => alReportar(ev.message + ' · ' + (ev.filename || 'ventana'))
  const enRechazo = (ev: PromiseRejectionEvent): void => {
    const r: unknown = ev.reason
    alReportar((r instanceof Error ? r.message : String(r)) + ' · promesa')
  }
  addEventListener('error', enError)
  addEventListener('unhandledrejection', enRechazo)
  return () => {
    removeEventListener('error', enError)
    removeEventListener('unhandledrejection', enRechazo)
  }
}

/* ─────────── sonido reactivo (Web Audio API) ─────────── */
export type MotorSonido = {
  activar: () => Promise<void>
  intensidad: (v: number) => void
  silenciar: () => void
  activo: () => boolean
}

/** Portadora sintética que responde al scroll. Sólo se crea si el usuario la pide. */
export function crearMotorSonido(): MotorSonido {
  let ctx: AudioContext | null = null
  let ganancia: GainNode | null = null
  let filtro: BiquadFilterNode | null = null
  let osc1: OscillatorNode | null = null
  let osc2: OscillatorNode | null = null

  const activar = async (): Promise<void> => {
    if (ctx) {
      await ctx.resume()
      return
    }
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return
    ctx = new Ctor()
    ganancia = ctx.createGain()
    ganancia.gain.value = 0.0001
    filtro = ctx.createBiquadFilter()
    filtro.type = 'lowpass'
    filtro.frequency.value = 420
    osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.value = 96
    osc2 = ctx.createOscillator()
    osc2.type = 'triangle'
    osc2.frequency.value = 192.5
    osc1.connect(filtro)
    osc2.connect(filtro)
    filtro.connect(ganancia)
    ganancia.connect(ctx.destination)
    osc1.start()
    osc2.start()
    await ctx.resume()
  }

  const intensidad = (v: number): void => {
    if (!ctx || !ganancia || !filtro || !osc1 || !osc2) return
    const nivel = Math.max(0, Math.min(1, v))
    ganancia.gain.setTargetAtTime(0.012 + nivel * 0.05, ctx.currentTime, 0.12)
    filtro.frequency.setTargetAtTime(320 + nivel * 1500, ctx.currentTime, 0.15)
    osc1.frequency.setTargetAtTime(92 + nivel * 70, ctx.currentTime, 0.2)
    osc2.frequency.setTargetAtTime(184 + nivel * 150, ctx.currentTime, 0.2)
  }

  const silenciar = (): void => {
    if (!ctx || !ganancia) return
    ganancia.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08)
  }

  return { activar, intensidad, silenciar, activo: () => ctx !== null && ctx.state === 'running' }
}
