import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { usarBlog } from '../estado'
import { ir } from '../enrutado'
import { crearMotorSonido, vigilarErrores, type MotorSonido } from '../lib/plataforma'

export const NAVEGACION = [
  { texto: 'Inicio', destino: '' },
  { texto: 'Entradas', destino: 'entradas' },
  { texto: 'Sobre mí', destino: 'entrada/sobre-mi' },
  { texto: 'Informe', destino: 'informe' }
] as const

/* ─────────── sonido reactivo al scroll ─────────── */
export function usarAudioReactivo(): void {
  const motor = useRef<MotorSonido | null>(null)
  const activo = usarBlog((s) => s.sonidoActivo)
  useEffect(() => {
    if (!activo) {
      motor.current?.silenciar()
      return
    }
    motor.current = motor.current ?? crearMotorSonido()
    void motor.current.activar()
    const alScroll = (): void => {
      const total = document.documentElement.scrollHeight - innerHeight
      motor.current?.intensidad(total > 0 ? Math.min(1, scrollY / total) : 0)
    }
    addEventListener('scroll', alScroll, { passive: true })
    alScroll()
    return () => removeEventListener('scroll', alScroll)
  }, [activo])
}

/* ─────────── cursor propio (sólo puntero fino) ─────────── */
export function Cursor() {
  const activo = usarBlog((s) => s.cursorActivo)
  const aro = useRef<HTMLDivElement>(null)
  const punto = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activo || !matchMedia('(pointer: fine)').matches) return
    const raiz = document.documentElement
    raiz.style.setProperty('cursor', 'none')
    gsap.set([aro.current, punto.current], { xPercent: -50, yPercent: -50 })
    const moverAro = gsap.quickTo(aro.current, 'x', { duration: 0.55, ease: 'power3.out' })
    const moverAroY = gsap.quickTo(aro.current, 'y', { duration: 0.55, ease: 'power3.out' })
    const moverPunto = gsap.quickTo(punto.current, 'x', { duration: 0.12, ease: 'power2.out' })
    const moverPuntoY = gsap.quickTo(punto.current, 'y', { duration: 0.12, ease: 'power2.out' })

    const alMover = (ev: PointerEvent): void => {
      moverAro(ev.clientX)
      moverAroY(ev.clientY)
      moverPunto(ev.clientX)
      moverPuntoY(ev.clientY)
    }
    const alEntrar = (): void => {
      gsap.to(aro.current, { scale: 1.9, opacity: 0.9, duration: 0.25 })
    }
    const alSalir = (): void => {
      gsap.to(aro.current, { scale: 1, opacity: 0.55, duration: 0.25 })
    }

    addEventListener('pointermove', alMover)
    const interactivos = document.querySelectorAll('a, button, input, summary, [role="button"]')
    interactivos.forEach((el) => {
      el.addEventListener('pointerenter', alEntrar)
      el.addEventListener('pointerleave', alSalir)
    })
    return () => {
      removeEventListener('pointermove', alMover)
      interactivos.forEach((el) => {
        el.removeEventListener('pointerenter', alEntrar)
        el.removeEventListener('pointerleave', alSalir)
      })
      raiz.style.removeProperty('cursor')
    }
  }, [activo])

  if (!activo) return null
  return (
    <>
      <div ref={aro} className="cursor-anillo" aria-hidden="true" />
      <div ref={punto} className="cursor-punto" aria-hidden="true" />
    </>
  )
}

/* ─────────── barra de progreso de lectura ─────────── */
export function Progreso() {
  const barra = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const alScroll = (): void => {
      const total = document.documentElement.scrollHeight - innerHeight
      const avance = total > 0 ? Math.min(1, scrollY / total) : 0
      if (barra.current) barra.current.style.transform = `scaleX(${avance})`
    }
    addEventListener('scroll', alScroll, { passive: true })
    alScroll()
    return () => removeEventListener('scroll', alScroll)
  }, [])
  return (
    <div
      ref={barra}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: '0 0 auto 0',
        height: 2,
        transformOrigin: 'left center',
        transform: 'scaleX(0)',
        background: 'linear-gradient(90deg, rgb(53 230 255 / 0.9), rgb(125 148 166 / 0.7))',
        zIndex: 80
      }}
    />
  )
}
/* ─────────── vigilancia silenciosa: sólo avisa si algo falla ─────────── */
export function usarAvisos(): void {
  const agregarError = usarBlog((s) => s.agregarError)
  useEffect(() => {
    const dejar = vigilarErrores((texto) => agregarError(texto))
    return () => dejar()
  }, [agregarError])
}

/* ─────────── instalación como app (PWA) ─────────── */
type EventoInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

export function usarInstalador(): { puede: boolean; lanzar: () => Promise<void> } {
  const [evento, setEvento] = useState<EventoInstalar | null>(null)
  const [instalada, setInstalada] = useState(false)
  useEffect(() => {
    const alPoder = (ev: Event): void => {
      ev.preventDefault()
      setEvento(ev as EventoInstalar)
    }
    const alInstalar = (): void => setInstalada(true)
    addEventListener('beforeinstallprompt', alPoder)
    addEventListener('appinstalled', alInstalar)
    return () => {
      removeEventListener('beforeinstallprompt', alPoder)
      removeEventListener('appinstalled', alInstalar)
    }
  }, [])
  return {
    puede: Boolean(evento) && !instalada,
    lanzar: async (): Promise<void> => {
      await evento?.prompt()
      setEvento(null)
    }
  }
}

/* ─────────── barra de navegación ─────────── */
export function Barra() {
  const [abierto, setAbierto] = useState(false)
  const sonido = usarBlog((s) => s.sonidoActivo)
  const marcarSonido = usarBlog((s) => s.marcarSonido)
  const cursor = usarBlog((s) => s.cursorActivo)
  const alternarCursor = usarBlog((s) => s.alternarCursor)
  const { puede, lanzar } = usarInstalador()

  const irA = (destino: string): void => {
    setAbierto(false)
    ir(destino)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-fondo/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5" aria-label="Navegación principal">
        <button onClick={() => irA('')} className="flex items-center gap-2.5 text-left">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-acento/25 to-acento2/25 ring-1 ring-white/15">
            <span className="latido size-2.5 rounded-full bg-acento shadow-[0_0_12px_3px_rgba(53,230,255,.65)]" />
          </span>
          <span>
            <strong className="block text-sm leading-none font-black tracking-tight">ZenithSpace</strong>
            <span className="text-[10px] font-bold tracking-[0.2em] text-suave uppercase">investigaciones · redes</span>
          </span>
        </button>

        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {NAVEGACION.map((enlace) => (
            <li key={enlace.destino}>
              <button
                onClick={() => irA(enlace.destino)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-suave transition-colors hover:bg-white/5 hover:text-white"
              >
                {enlace.texto}
              </button>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          {puede && (
            <button className="boton hidden sm:inline-flex" onClick={() => void lanzar()}>
              ⤓ Instalar app
            </button>
          )}
          <button
            className="rounded-lg px-2.5 py-2 text-base transition-colors hover:bg-white/5"
            aria-pressed={sonido}
            title={sonido ? 'Silenciar el sonido de lectura' : 'Activar un sonido tenue al avanzar'}
            onClick={() => marcarSonido(!sonido)}
          >
            {sonido ? '🔊' : '🔇'}
          </button>
          <button
            className="rounded-lg px-2.5 py-2 text-base transition-colors hover:bg-white/5"
            aria-pressed={cursor}
            title={cursor ? 'Usar el cursor del sistema' : 'Usar el cursor propio'}
            onClick={alternarCursor}
          >
            🖱️
          </button>
          <button
            className="rounded-lg px-2.5 py-2 text-base transition-colors hover:bg-white/5 md:hidden"
            aria-expanded={abierto}
            aria-label="Abrir menú"
            onClick={() => setAbierto(!abierto)}
          >
            {abierto ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {abierto && (
        <ul className="border-t border-white/10 bg-fondo/95 px-4 py-2 md:hidden">
          {NAVEGACION.map((enlace) => (
            <li key={enlace.destino}>
              <button
                onClick={() => irA(enlace.destino)}
                className="w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-suave hover:bg-white/5 hover:text-white"
              >
                {enlace.texto}
              </button>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
/* ─────────── pie de página ─────────── */
export function Pie() {
  const anio = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-white/10 bg-fondo2/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr]">
        <div>
          <h2 className="text-lg font-black tracking-tight">ZenithSpace</h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-suave">
            Cuaderno de investigaciones de la materia de Redes. Cada entrada se prepara para clase, con las fuentes
            citadas al final para quien quiera profundizar.
          </p>
          <p className="mt-4 font-mono text-xs text-suave">
            © {anio} Calle Cucho Josué Salomón · El Alto, Bolivia 🇧🇴
          </p>
        </div>

        <nav aria-label="Secciones del blog">
          <h3 className="etiqueta">Navegar</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAVEGACION.map((enlace) => (
              <li key={enlace.destino}>
                <button className="text-suave transition-colors hover:text-acento" onClick={() => ir(enlace.destino)}>
                  {enlace.texto}
                </button>
              </li>
            ))}
            <li>
              <a className="text-suave transition-colors hover:text-acento" href="https://github.com/zeyniyoima-art" target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="etiqueta">De qué trata</h3>
          <ul className="mt-4 space-y-2 text-sm text-suave">
            <li>WiMAX y las redes inalámbricas metropolitanas</li>
            <li>Radioenlaces, zona de Fresnel y espectro</li>
            <li>Historia de las telecomunicaciones en Bolivia</li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-suave">
            Los datos se pueden verificar: las referencias van al pie de cada entrada y el informe íntegro queda
            disponible para descargar y leer sin conexión.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─────────── volver arriba ─────────── */
export function BotonArriba() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const alScroll = (): void => setVisible(scrollY > 700)
    addEventListener('scroll', alScroll, { passive: true })
    alScroll()
    return () => removeEventListener('scroll', alScroll)
  }, [])
  return (
    <button
      className="boton fixed right-4 bottom-4 z-40 rounded-full px-3.5 py-3 shadow-lg transition-opacity"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
      aria-hidden={!visible}
      title="Volver arriba"
      onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </button>
  )
}

/** Aviso flotante con los errores capturados (útil mientras se desarrolla). */
export function AvisoErrores() {
  const errores = usarBlog((s) => s.errores)
  const limpiar = usarBlog((s) => s.limpiarErrores)
  if (errores.length === 0) return null
  return (
    <div className="tarjeta fixed bottom-4 left-4 z-40 max-w-sm text-xs" role="status">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-alerta">No se pudieron cargar {errores.length} elemento(s) de la página</strong>
        <button className="text-suave hover:text-texto" onClick={limpiar} aria-label="Ocultar aviso">
          ✕
        </button>
      </div>
      <ul className="mt-2 space-y-1 font-mono text-[11px] text-suave">
        {errores.map((texto) => (
          <li key={texto} className="truncate">
            {texto}
          </li>
        ))}
      </ul>
    </div>
  )
}


