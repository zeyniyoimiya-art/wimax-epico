import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useRevelar } from './ui'
import { fresnelJs } from '../lib/wasm'
import { prefiereMenosMovimiento } from '../lib/plataforma'
import type { Hito } from '../datos/esquemas'

const TONO: Record<Hito['tono'], { borde: string; texto: string; fondo: string }> = {
  base: { borde: 'border-white/15', texto: 'text-suave', fondo: 'bg-white/5' },
  auge: { borde: 'border-acento/50', texto: 'text-acento', fondo: 'bg-acento/10' },
  caida: { borde: 'border-alerta/50', texto: 'text-alerta', fondo: 'bg-alerta/10' },
  bolivia: { borde: 'border-ok/50', texto: 'text-ok', fondo: 'bg-ok/10' }
}

/* ═══════════ LÍNEA DE TIEMPO INTERACTIVA ═══════════ */
export function LineaTiempo({ hitos }: { hitos: Hito[] }) {
  const [activo, setActivo] = useState(hitos.length - 1)
  const detalle = useRef<HTMLDivElement>(null)
  const hito = hitos[activo]
  const tono = TONO[hito.tono]

  useEffect(() => {
    if (!detalle.current || prefiereMenosMovimiento()) return
    const animacion = gsap.fromTo(
      detalle.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
    )
    return () => {
      animacion.kill()
    }
  }, [activo])

  return (
    <div>
      <div className="ocultar-scroll -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-3" role="tablist" aria-label="Años de la historia de WiMAX">
        {hitos.map((elemento, indice) => (
          <button
            key={elemento.anio + elemento.titulo}
            onClick={() => setActivo(indice)}
            role="tab"
            aria-selected={indice === activo}
            className={
              'chip shrink-0 snap-start transition-colors ' +
              (indice === activo ? 'border-acento/70 bg-acento/15 text-white' : 'text-suave hover:text-white')
            }
          >
            <span aria-hidden="true">{elemento.emoji}</span>
            <span className="font-mono">{elemento.anio}</span>
          </button>
        ))}
      </div>

      <div className={'tarjeta mt-2 border ' + tono.borde}>
        <div ref={detalle}>
          <div className="flex flex-wrap items-center gap-3">
            <span className={'rounded-xl px-3 py-1 font-mono text-sm font-black ' + tono.fondo + ' ' + tono.texto}>
              {hito.anio}
            </span>
            <h3 className="text-xl font-black tracking-tight">{hito.titulo}</h3>
          </div>
          <p className="mt-3 leading-relaxed text-suave">{hito.texto}</p>
        </div>
        <div className="mt-5 flex items-center gap-2">
          <button className="boton" onClick={() => setActivo((i) => Math.max(0, i - 1))} disabled={activo === 0}>
            ← Anterior
          </button>
          <button
            className="boton"
            onClick={() => setActivo((i) => Math.min(hitos.length - 1, i + 1))}
            disabled={activo === hitos.length - 1}
          >
            Siguiente →
          </button>
          <span className="ml-auto font-mono text-xs text-suave">
            {activo + 1} / {hitos.length}
          </span>
        </div>
      </div>
    </div>
  )
}
/* ═══════════ LABORATORIO DE ZONA DE FRESNEL (WASM) ═══════════ */
export function Laboratorio() {
  const [d1, setD1] = useState(1200)
  const [d2, setD2] = useState(800)
  const [mhz, setMhz] = useState(3500)
  const ref = useRevelar<HTMLDivElement>()

  const hz = mhz * 1e6
  const radioJs = useMemo(() => fresnelJs(d1, d2, hz), [d1, d2, hz])
  const altura = 10 + Math.max(0.2, Math.min(1, radioJs / 22)) * 74

  const controles = [
    { etiqueta: 'Distancia a la torre (d₁)', valor: d1, min: 100, max: 5000, paso: 50, fijar: setD1, unidad: 'm' },
    { etiqueta: 'Distancia al cliente (d₂)', valor: d2, min: 100, max: 5000, paso: 50, fijar: setD2, unidad: 'm' },
    { etiqueta: 'Frecuencia de la portadora', valor: mhz, min: 700, max: 5800, paso: 100, fijar: setMhz, unidad: 'MHz' }
  ]

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
      <div className="tarjeta">
        <h3 className="etiqueta">Parámetros del enlace</h3>
        {controles.map((control) => (
          <label key={control.etiqueta} className="mt-4 block">
            <span className="flex items-center justify-between gap-3 text-sm font-semibold">
              {control.etiqueta}
              <span className="font-mono text-acento">
                {control.valor} {control.unidad}
              </span>
            </span>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.paso}
              value={control.valor}
              onChange={(ev) => control.fijar(Number(ev.target.value))}
              className="mt-2 w-full accent-[#35e6ff]"
              aria-label={control.etiqueta}
            />
          </label>
        ))}

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wider text-suave">Radio de Fresnel</p>
            <p className="mt-1 font-mono text-xl font-black text-acento">{radioJs.toFixed(2)} m</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wider text-suave">Despeje del 60 %</p>
            <p className="mt-1 font-mono text-xl font-black">{(radioJs * 0.6).toFixed(2)} m</p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-suave">
          El 60 % del primer radio de Fresnel debe quedar libre de obstáculos: por eso las torres son altas y por eso una
          loma entre la antena y tu casa arruina la señal.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="tarjeta">
          <h3 className="etiqueta">Cómo se calcula</h3>
          <p className="mt-4 text-sm leading-relaxed text-suave">El radio del primer elipsoide de Fresnel sale de la geometría del enlace:</p>
          <p className="mt-3 font-mono text-[0.95rem] text-texto">r = √( λ · d₁ · d₂ / (d₁ + d₂) )</p>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-suave">
            <li>
              <strong className="font-medium text-texto">λ</strong> es la longitud de onda, que depende de la frecuencia
              de la portadora (λ = c / f).
            </li>
            <li>
              <strong className="font-medium text-texto">d₁ y d₂</strong> son las distancias desde cada extremo del
              enlace hasta el punto que se analiza.
            </li>
            <li>
              <strong className="font-medium text-texto">Regla del 60 %:</strong> el enlace se considera despejado
              cuando los obstáculos no invaden esa porción del primer radio.
            </li>
          </ul>
          <p className="mt-4 border-t border-white/[0.07] pt-4 text-xs leading-relaxed text-suave">
            Los valores se recalculan al mover cada control. Podés repetir el cálculo con una calculadora y comparar.
          </p>
        </div>

        <div className="tarjeta">
          <h3 className="etiqueta">Perfil del enlace</h3>
          <svg viewBox="0 0 420 220" className="mt-3 w-full" role="img" aria-label="Zona de Fresnel entre la torre y el cliente">
            <defs>
              <linearGradient id="rellenoFresnel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#35e6ff" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#8b5cff" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            <line x1="24" y1="180" x2="404" y2="180" stroke="rgba(255,255,255,.25)" strokeWidth="1" />
            <ellipse cx="214" cy="180" rx="186" ry={altura} fill="url(#rellenoFresnel)" stroke="rgba(53,230,255,.6)" />
            <g stroke="#9db0d2" strokeWidth="2">
              <line x1="28" y1="180" x2="28" y2="70" />
              <line x1="16" y1="82" x2="40" y2="82" />
              <line x1="16" y1="104" x2="40" y2="104" />
            </g>
            <circle cx="28" cy="70" r="4" fill="#ff4d6d" />
            <g stroke="#9db0d2" strokeWidth="2">
              <line x1="400" y1="180" x2="400" y2="152" />
              <rect x="392" y="132" width="16" height="20" rx="3" fill="rgba(255,255,255,.12)" />
            </g>
            <path d="M198 180 L214 118 L232 180 Z" fill="rgba(251,113,133,.35)" stroke="rgba(251,113,133,.85)" />
            <text x="214" y="205" textAnchor="middle" fill="#9db0d2" fontSize="11">
              obstáculo
            </text>
            <text x="12" y="60" fill="#9db0d2" fontSize="11">
              torre
            </text>
            <text x="380" y="122" fill="#9db0d2" fontSize="11">
              cliente
            </text>
            <text x="214" y="16" textAnchor="middle" fill="#35e6ff" fontSize="12" fontFamily="monospace">
              r = {radioJs.toFixed(2)} m
            </text>
          </svg>
          <p className="mt-2 text-xs leading-relaxed text-suave">
            El elipsoide muestra el volumen de espacio que la señal necesita para viajar limpia. Cuanto más alta la
            frecuencia, más pequeño el elipsoide… y más fácil es perder la línea de vista.
          </p>
        </div>
      </div>

    </div>
  )
}

