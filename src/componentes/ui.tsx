import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefiereMenosMovimiento } from '../lib/plataforma'

gsap.registerPlugin(ScrollTrigger)

/** Revela el elemento al entrar en pantalla (respeta “menos movimiento”). */
export function useRevelar<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefiereMenosMovimiento()) return
    const animacion = gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      }
    )
    return () => {
      animacion.scrollTrigger?.kill()
      animacion.kill()
    }
  }, [])
  return ref
}

export function Seccion({
  id,
  etiqueta,
  titulo,
  descripcion,
  children,
  ancho = 'normal'
}: {
  id: string
  etiqueta: string
  titulo: string
  descripcion?: string
  children: ReactNode
  ancho?: 'normal' | 'ancho'
}) {
  const ref = useRevelar<HTMLElement>()
  return (
    <section id={id} ref={ref} className="scroll-mt-24 py-12 sm:py-16">
      <div className={ancho === 'ancho' ? 'mx-auto max-w-7xl px-4' : 'mx-auto max-w-5xl px-4'}>
        <p className="etiqueta">{etiqueta}</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{titulo}</h2>
        {descripcion && <p className="mt-3 max-w-3xl leading-relaxed text-suave">{descripcion}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

export function Pildora({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>
}

export function DatoRapido({ etiqueta, valor, detalle }: { etiqueta: string; valor: string; detalle: string }) {
  return (
    <article className="tarjeta">
      <p className="etiqueta">{etiqueta}</p>
      <p className="mt-2 text-2xl font-black tracking-tight text-acento">{valor}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-suave">{detalle}</p>
    </article>
  )
}

export function BarraFuerza({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  const ref = useRevelar<HTMLDivElement>()
  return (
    <div className="flex items-center gap-3" title={`${etiqueta}: ${valor}%`}>
      <span className="w-14 shrink-0 font-mono text-[11px] text-suave">{valor}%</span>
      <div ref={ref} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-acento to-acento2" style={{ width: `${valor}%` }} />
      </div>
    </div>
  )
}

export function TablaComparativa({
  filas
}: {
  filas: { criterio: string; wifi: string; wimax: string; destaca: boolean }[]
}) {
  return (
    <div className="cuadricula-cq tarjeta overflow-hidden !p-0">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">Comparativa entre Wi-Fi (IEEE 802.11) y WiMAX (IEEE 802.16)</caption>
        <thead>
          <tr className="bg-white/5 text-xs tracking-wider text-suave uppercase">
            <th scope="col" className="px-4 py-3 font-bold">Criterio</th>
            <th scope="col" className="px-4 py-3 font-bold">Wi-Fi · 802.11</th>
            <th scope="col" className="px-4 py-3 font-bold">WiMAX · 802.16</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.criterio} className="border-t border-white/10 align-top">
              <th scope="row" className="px-4 py-3 font-semibold">
                {fila.criterio}
              </th>
              <td className="px-4 py-3 text-suave">{fila.wifi}</td>
              <td className={'px-4 py-3 ' + (fila.destaca ? 'font-semibold text-white' : 'text-suave')}>{fila.wimax}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Ficha de trabajo: deja por escrito cómo se investigó y cómo se cita.
 * Acompaña a cada entrada como respaldo académico.
 */
export function FichaDelTrabajo({ compacto = false }: { compacto?: boolean }) {
  const anio = new Date().getFullYear()
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="tarjeta">
        <h3 className="text-sm font-black tracking-wider text-acento uppercase">Cómo se investigó</h3>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-suave">
          <li>
            <strong className="text-white">Fuentes primarias y de prensa.</strong> Anuncios de los operadores, notas
            periodísticas de la época y documentos de los organismos reguladores.
          </li>
          <li>
            <strong className="text-white">Contraste de datos.</strong> Cada fecha y cada cifra se verificó en al menos
            dos referencias antes de entrar al informe.
          </li>
          <li>
            <strong className="text-white">Cálculos a la vista.</strong> Las fórmulas de radioenlace se resuelven con sus
            unidades y supuestos, para que cualquiera pueda repetir el resultado.
          </li>
        </ul>
      </div>

      <div className="tarjeta">
        <h3 className="text-sm font-black tracking-wider text-acento uppercase">Cómo citar este trabajo</h3>
        <p className="mt-4 font-mono text-xs leading-relaxed text-suave">
          Salomón, C. C. J. ({anio}). «Red WiMAX: la promesa inalámbrica que llegó a Bolivia». ZenithSpace ·
          investigaciones de la materia de Redes. El Alto, Bolivia.
        </p>
        {!compacto && (
          <p className="mt-4 border-t border-white/5 pt-4 text-xs leading-relaxed text-suave">
            Las referencias completas están al final de la entrada, y el informe íntegro puede descargarse para
            consultarlo sin conexión.
          </p>
        )}
      </div>
    </div>
  )
}
