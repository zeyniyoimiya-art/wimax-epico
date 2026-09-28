import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useRevelar } from './ui'
import { prefiereMenosMovimiento } from '../lib/plataforma'
import type { Empresa, Fuente, HitoBolivia, Personaje, Termino } from '../datos/esquemas'

/* Esquema aproximado de Bolivia (sin escala) para ubicar los despliegues. */
const CONTORNO =
  'M140.8 6.4 L208 32 L272 96 L320 144 L384 208 L400 272 L384 320 L368 352 L240 400 L176 428.8 L96 400 L48 304 L16 256 L32 192 L48 160 L48 96 L64 48 L112 16 Z'

const CIUDADES = [
  { nombre: 'El Alto / La Paz', x: 59, y: 224, nota: 'VIVA y Entel (2008)', lado: 1 },
  { nombre: 'Cochabamba', x: 123, y: 253, nota: 'VIVA (2008)', lado: 1 },
  { nombre: 'Santa Cruz', x: 218, y: 266, nota: 'COTAS: 2004 y 2009', lado: 1 }
]

export function MapaBolivia({ hitos, empresas, proveedores, regulador }: {
  hitos: HitoBolivia[]
  empresas: Empresa[]
  proveedores: string[]
  regulador: string
}) {
  const ref = useRevelar<HTMLDivElement>()
  const capa = useRef<SVGGElement>(null)

  useEffect(() => {
    const grupo = capa.current
    if (!grupo || prefiereMenosMovimiento()) return
    const animaciones = gsap.utils
      .toArray<SVGCircleElement>(grupo.querySelectorAll('[data-onda]'))
      .map((circulo, indice) =>
        gsap.fromTo(
          circulo,
          { attr: { r: 3 }, opacity: 0.85 },
          { attr: { r: 46 }, opacity: 0, duration: 2.6, repeat: -1, ease: 'power1.out', delay: indice * 0.6 }
        )
      )
    return () => animaciones.forEach((animacion) => animacion.kill())
  }, [])

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
      <div className="tarjeta">
        <svg viewBox="0 0 420 440" className="h-auto w-full" role="img" aria-label="Esquema de Bolivia con las ciudades donde se desplegó WiMAX">
          <path d={CONTORNO} fill="rgba(53,230,255,.07)" stroke="rgba(53,230,255,.45)" strokeWidth="1.5" />
          <g ref={capa}>
            {CIUDADES.map((ciudad) => (
              <circle key={ciudad.nombre} cx={ciudad.x} cy={ciudad.y} r="3" fill="none" stroke="#35e6ff" strokeWidth="1.2" data-onda />
            ))}
          </g>
          {CIUDADES.map((ciudad) => (
            <circle key={'punto-' + ciudad.nombre} cx={ciudad.x} cy={ciudad.y} r="5" fill="#ff4d6d" />
          ))}
          {CIUDADES.map((ciudad) => (
            <g key={'rotulo-' + ciudad.nombre}>
              <text x={ciudad.x + 11} y={ciudad.y - 2} fill="#e9eefb" fontSize="11.5" fontWeight="700">
                {ciudad.nombre}
              </text>
              <text x={ciudad.x + 11} y={ciudad.y + 12} fill="#9db0d2" fontSize="10">
                {ciudad.nota}
              </text>
            </g>
          ))}
        </svg>
        <p className="mt-2 text-xs leading-relaxed text-suave">
          Esquema aproximado del territorio boliviano (sin escala) con las ciudades donde se documentaron despliegues
          WiMAX. Las ondas indican cobertura inalámbrica, no límites administrativos.
        </p>
      </div>

      <div>
        <ol className="space-y-3">
          {hitos.map((hito) => (
            <li key={hito.titulo} className="tarjeta">
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden="true">{hito.emoji}</span>
                <h3 className="font-black tracking-tight">{hito.titulo}</h3>
                <span className="chip ml-auto shrink-0 font-mono">{hito.anio}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-suave">{hito.texto}</p>
            </li>
          ))}
        </ol>

        <div className="tarjeta mt-4">
          <h3 className="etiqueta">Empresas y proveedores</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-suave">
                  <th scope="col" className="py-2 pr-3 font-bold">Empresa</th>
                  <th scope="col" className="py-2 pr-3 font-bold">Tecnología</th>
                  <th scope="col" className="py-2 pr-3 font-bold">Proveedor</th>
                  <th scope="col" className="py-2 pr-3 font-bold">Zona</th>
                  <th scope="col" className="py-2 font-bold">Año</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa.empresa} className="border-t border-white/10 align-top">
                    <th scope="row" className="py-2.5 pr-3 font-bold text-white">
                      {empresa.empresa}
                      <span className="mt-1 block font-normal text-suave">{empresa.rol}</span>
                    </th>
                    <td className="py-2.5 pr-3 text-suave">{empresa.tecnologia}</td>
                    <td className="py-2.5 pr-3 text-suave">{empresa.proveedor}</td>
                    <td className="py-2.5 pr-3 text-suave">{empresa.zona}</td>
                    <td className="py-2.5 font-mono text-suave">{empresa.anio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {proveedores.map((proveedor) => (
              <li key={proveedor} className="chip">{proveedor}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-suave">
            <strong className="text-white">Regulador:</strong> {regulador}
          </p>
        </div>
      </div>
    </div>
  )
}
/* ═══════════ PERSONAJES (con filtro) ═══════════ */
export function Personajes({ personajes }: { personajes: Personaje[] }) {
  const [filtro, setFiltro] = useState<'todos' | 'bolivia' | 'mundo'>('todos')
  const ref = useRevelar<HTMLDivElement>()
  const lista = useMemo(
    () => personajes.filter((p) => (filtro === 'todos' ? true : filtro === 'bolivia' ? p.boliviano : !p.boliviano)),
    [personajes, filtro]
  )
  const opciones: { clave: typeof filtro; texto: string }[] = [
    { clave: 'todos', texto: `Todos (${personajes.length})` },
    { clave: 'bolivia', texto: `Bolivia (${personajes.filter((p) => p.boliviano).length})` },
    { clave: 'mundo', texto: `Internacionales (${personajes.filter((p) => !p.boliviano).length})` }
  ]

  return (
    <div ref={ref}>
      <div className="flex flex-wrap gap-2">
        {opciones.map((opcion) => (
          <button
            key={opcion.clave}
            onClick={() => setFiltro(opcion.clave)}
            aria-pressed={filtro === opcion.clave}
            className={
              'chip transition-colors ' + (filtro === opcion.clave ? 'border-acento/70 bg-acento/15 text-white' : 'text-suave hover:text-white')
            }
          >
            {opcion.texto}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((personaje) => (
          <article key={personaje.nombre} className="tarjeta">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-xl ring-1 ring-white/10" aria-hidden="true">
                {personaje.bandera}
              </span>
              <div>
                <h3 className="font-black tracking-tight">{personaje.nombre}</h3>
                <p className="text-xs font-semibold text-acento">{personaje.rol}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-suave">{personaje.texto}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

/* ═══════════ APRENDIZAJES ═══════════ */
export function Aprendizajes({ aprendizajes, pendiente }: { aprendizajes: string[]; pendiente?: string }) {
  const ref = useRevelar<HTMLDivElement>()
  const titulos = ['Lo técnico no basta', 'Bolivia estuvo en el mapa', 'Los puentes conectan']
  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-3">
      {aprendizajes.map((texto, indice) => (
        <article key={texto.slice(0, 24)} className="tarjeta">
          <span className="font-mono text-3xl font-black text-acento/40">{String(indice + 1).padStart(2, '0')}</span>
          <h3 className="mt-2 font-black tracking-tight">{titulos[indice] ?? 'Aprendizaje'}</h3>
          <p className="mt-2 text-sm leading-relaxed text-suave">{texto}</p>
        </article>
      ))}
      {pendiente && (
        <article className="tarjeta border-ambar/40 lg:col-span-3">
          <h3 className="font-black tracking-tight text-ambar">🔍 Lo que queda por investigar</h3>
          <p className="mt-2 text-sm leading-relaxed text-suave">{pendiente}</p>
        </article>
      )}
    </div>
  )
}
/* ═══════════ GLOSARIO BUSCABLE ═══════════ */
export function Glosario({ terminos }: { terminos: Termino[] }) {
  const [busqueda, setBusqueda] = useState('')
  const ref = useRevelar<HTMLDivElement>()
  const filtrados = useMemo(() => {
    const consulta = busqueda.trim().toLowerCase()
    if (!consulta) return terminos
    return terminos.filter(
      (termino) =>
        termino.termino.toLowerCase().includes(consulta) ||
        termino.definicion.toLowerCase().includes(consulta) ||
        termino.etiquetas.some((etiqueta) => etiqueta.toLowerCase().includes(consulta))
    )
  }, [terminos, busqueda])

  return (
    <div ref={ref}>
      <label className="block max-w-md">
        <span className="sr-only">Buscar en el glosario</span>
        <input
          type="search"
          value={busqueda}
          onChange={(ev) => setBusqueda(ev.target.value)}
          placeholder="Buscar término: Fresnel, OFDMA, backhaul…"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-texto placeholder:text-suave/70 focus:border-acento/60"
        />
      </label>
      <p className="mt-2 font-mono text-xs text-suave">
        {filtrados.length} / {terminos.length} términos
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((termino) => (
          <div key={termino.termino} className="tarjeta">
            <dt className="font-bold text-acento">{termino.termino}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-suave">{termino.definicion}</dd>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {termino.etiquetas.map((etiqueta) => (
                <span key={etiqueta} className="chip !px-2 !py-0.5 text-[10px]">
                  {etiqueta}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      {filtrados.length === 0 && (
        <p className="mt-6 text-sm text-suave">
          No hay términos que coincidan con “{busqueda}”. Probá con otra palabra o revisá la ortografía.
        </p>
      )}
    </div>
  )
}

/* ═══════════ FUENTES ═══════════ */
const BLOQUES: { clave: Fuente['bloque']; titulo: string; detalle: string }[] = [
  { clave: 'general', titulo: 'Generales y técnicas', detalle: 'Normas IEEE, terminología y organismos.' },
  { clave: 'auge', titulo: 'Auge internacional', detalle: 'Despliegues, empresas y el paso a LTE.' },
  { clave: 'bolivia', titulo: 'Bolivia', detalle: 'Operadores, proveedores y regulador.' }
]

export function Fuentes({ fuentes }: { fuentes: Fuente[] }) {
  const ref = useRevelar<HTMLDivElement>()
  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-3">
      {BLOQUES.map((bloque) => {
        const lista = fuentes.filter((fuente) => fuente.bloque === bloque.clave)
        return (
          <section key={bloque.clave} className="tarjeta">
            <h3 className="etiqueta">{bloque.titulo}</h3>
            <p className="mt-1 text-xs text-suave">{bloque.detalle}</p>
            <ol className="mt-4 space-y-2.5 text-sm">
              {lista.map((fuente) => (
                <li key={fuente.titulo} className="border-b border-white/5 pb-2.5 last:border-0">
                  {fuente.url ? (
                    <a className="enlace" href={fuente.url} target="_blank" rel="noreferrer">
                      {fuente.titulo} ↗
                    </a>
                  ) : (
                    <span className="text-texto">{fuente.titulo}</span>
                  )}
                  <span className="mt-0.5 block text-xs text-suave">{fuente.medio}</span>
                </li>
              ))}
            </ol>
          </section>
        )
      })}
      <p className="text-xs leading-relaxed text-suave lg:col-span-3">
        Las fuentes marcadas sin enlace corresponden a notas de prensa de la época que no tienen versión digital estable
        disponible; se citan por título y medio para que puedan verificarse en hemeroteca. Todas las demás enlazan al
        original.
      </p>
    </div>
  )
}



