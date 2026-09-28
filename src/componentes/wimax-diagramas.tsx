import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { BarraFuerza, useRevelar } from './ui'
import { prefiereMenosMovimiento } from '../lib/plataforma'
import type { Pais } from '../datos/esquemas'

/* ═══════════ DIAGRAMA ANIMADO DE LA RED ═══════════ */
const PASOS = [
  { titulo: '1 · Equipos del usuario', texto: 'Laptops, PCs y teléfonos se conectan por Wi-Fi o cable a la antena del cliente.', color: '#9db0d2' },
  { titulo: '2 · Antena del cliente (CPE)', texto: 'Unidad exterior que apunta a la torre con línea de vista: el “módem inalámbrico”.', color: '#35e6ff' },
  { titulo: '3 · Estación base WiMAX', texto: 'La torre 802.16 reparte el espectro con OFDMA y antenas sectorizadas.', color: '#35e6ff' },
  { titulo: '4 · Backhaul', texto: 'El tráfico baja de la torre por microondas o fibra hasta el núcleo del operador.', color: '#8b5cff' },
  { titulo: '5 · Núcleo del operador', texto: 'Autenticación, direcciones IP, facturación y salida hacia Internet.', color: '#8b5cff' },
  { titulo: '6 · Internet', texto: 'El paquete cruza la red troncal y vuelve con el resultado. Todo en milisegundos.', color: '#4ade80' }
]

export function DiagramaRed() {
  const ref = useRevelar<HTMLDivElement>()
  const capa = useRef<SVGGElement>(null)
  const [paso, setPaso] = useState(2)

  useEffect(() => {
    const grupo = capa.current
    if (!grupo || prefiereMenosMovimiento()) return
    const trazos = gsap.utils.toArray<SVGLineElement>(grupo.querySelectorAll('[data-flujo]'))
    const animaciones = trazos.map((trazo, indice) =>
      gsap.fromTo(trazo, { strokeDashoffset: 26 }, { strokeDashoffset: 0, duration: 1.1, repeat: -1, ease: 'none', delay: indice * 0.18 })
    )
    return () => animaciones.forEach((animacion) => animacion.kill())
  }, [])

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      <div className="tarjeta">
        <svg viewBox="0 0 640 300" className="w-full" role="img" aria-label="Diagrama de una red WiMAX desde el usuario hasta Internet">
          <defs>
            <linearGradient id="degradadoTorre" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#35e6ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8b5cff" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <g ref={capa} strokeLinecap="round">
            <line x1="88" y1="230" x2="150" y2="228" stroke="#9db0d2" strokeWidth="2" strokeDasharray="6 6" data-flujo />
            <line x1="185" y1="215" x2="330" y2="105" stroke="url(#degradadoTorre)" strokeWidth="3" strokeDasharray="8 8" data-flujo />
            <line x1="362" y1="100" x2="468" y2="100" stroke="#8b5cff" strokeWidth="3" strokeDasharray="8 8" data-flujo />
            <line x1="502" y1="100" x2="558" y2="100" stroke="#8b5cff" strokeWidth="3" strokeDasharray="8 8" data-flujo />
          </g>

          <g>
            <rect x="30" y="215" width="34" height="24" rx="3" fill="rgba(255,255,255,.1)" stroke="#9db0d2" />
            <line x1="30" y1="243" x2="64" y2="243" stroke="#9db0d2" strokeWidth="2" />
            <rect x="70" y="222" width="16" height="30" rx="4" fill="rgba(255,255,255,.1)" stroke="#9db0d2" />
          </g>

          <g>
            <path d="M150 250 L150 215 L185 205 L185 240 Z" fill="rgba(53,230,255,.18)" stroke="#35e6ff" />
            <circle cx="167" cy="228" r="4" fill="#35e6ff" />
          </g>

          <g>
            <path d="M345 250 L332 100 M345 250 L358 100" stroke="#35e6ff" strokeWidth="3" fill="none" />
            <line x1="338" y1="140" x2="352" y2="140" stroke="#35e6ff" strokeWidth="2" />
            <line x1="335" y1="175" x2="355" y2="175" stroke="#35e6ff" strokeWidth="2" />
            <line x1="332" y1="210" x2="358" y2="210" stroke="#35e6ff" strokeWidth="2" />
            <circle cx="345" cy="94" r="5" fill="#ff4d6d" />
            <path d="M305 122 Q345 62 385 122" stroke="rgba(53,230,255,.45)" fill="none" strokeWidth="2" />
            <path d="M288 142 Q345 46 402 142" stroke="rgba(53,230,255,.22)" fill="none" strokeWidth="2" />
          </g>

          <g>
            <rect x="470" y="82" width="30" height="36" rx="4" fill="rgba(139,92,255,.2)" stroke="#8b5cff" />
            <line x1="485" y1="82" x2="485" y2="62" stroke="#8b5cff" strokeWidth="2" />
          </g>

          <g>
            <ellipse cx="596" cy="100" rx="40" ry="28" fill="rgba(139,92,255,.15)" stroke="#8b5cff" />
            <text x="596" y="105" textAnchor="middle" fill="#e9eefb" fontSize="11">Internet</text>
          </g>

          <text x="47" y="275" textAnchor="middle" fill="#9db0d2" fontSize="11">usuario</text>
          <text x="167" y="275" textAnchor="middle" fill="#9db0d2" fontSize="11">antena cliente</text>
          <text x="345" y="275" textAnchor="middle" fill="#9db0d2" fontSize="11">estación base</text>
          <text x="485" y="140" textAnchor="middle" fill="#9db0d2" fontSize="11">backhaul</text>
        </svg>
      </div>

      <ul className="space-y-2">
        {PASOS.map((elemento, indice) => (
          <li key={elemento.titulo}>
            <button
              onClick={() => setPaso(indice)}
              aria-pressed={indice === paso}
              className={
                'w-full rounded-xl border px-3.5 py-2.5 text-left transition-colors ' +
                (indice === paso ? 'border-acento/60 bg-acento/10' : 'border-white/10 bg-white/5 hover:border-white/25')
              }
            >
              <span className="text-sm font-bold" style={{ color: indice === paso ? elemento.color : undefined }}>
                {elemento.titulo}
              </span>
              {indice === paso && <span className="mt-1 block text-xs leading-relaxed text-suave">{elemento.texto}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
/* ═══════════ COBERTURA MUNDIAL ═══════════ */
export function Cobertura({ paises }: { paises: Pais[] }) {
  const ref = useRevelar<HTMLDivElement>()
  return (
    <div ref={ref}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paises.map((pais) => (
          <article key={pais.pais} className="tarjeta">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">{pais.bandera}</span>
              <div>
                <h3 className="font-black tracking-tight">{pais.pais}</h3>
                <p className="font-mono text-[11px] text-suave">{pais.anio}</p>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-acento">{pais.operador}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-suave">{pais.detalle}</p>
            <div className="mt-3">
              <BarraFuerza valor={pais.fuerza} etiqueta={pais.pais} />
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-suave">
        La barra es un indicador cualitativo del tamaño e impacto del despliegue en cada país (no mide velocidad), armado
        a partir de las fuentes citadas al final de la entrada.
      </p>
    </div>
  )
}

/* ═══════════ CAMPO DE ONDAS EN VIVO ═══════════ */
const WGSL = /* wgsl */ `
  @group(0) @binding(0) var<uniform> u: vec4f; // tiempo · _ · ancho · alto

  @vertex
  fn vs(@builtin(vertex_index) indice: u32) -> @builtin(position) vec4f {
    var posiciones = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
    return vec4f(posiciones[indice], 0.0, 1.0);
  }

  @fragment
  fn fs(@builtin(position) posicion: vec4f) -> @location(0) vec4f {
    let uv = vec2f(posicion.x / u.z, posicion.y / u.w);
    let centrado = uv * 2.0 - vec2f(1.0, 1.0);
    var brillo = 0.0;
    for (var i = 0; i < 5; i = i + 1) {
      let fi = f32(i);
      let ola = sin(centrado.x * (5.0 + fi * 2.5) + u.x * (1.2 + fi * 0.4));
      brillo += smoothstep(0.05, 0.0, abs(centrado.y - ola * (0.2 - fi * 0.02)));
    }
    var color = mix(vec3f(0.02, 0.05, 0.1), vec3f(0.21, 0.9, 1.0), clamp(brillo, 0.0, 1.0) * 0.85);
    let halo = pow(max(0.0, 1.0 - length(centrado - vec2f(0.0, 0.35)) * 1.5), 3.0);
    color = color + vec3f(0.48, 0.36, 1.0) * halo * 0.55;
    return vec4f(color, 1.0);
  }
`

export function PanelOndas() {
  const lienzo = useRef<HTMLCanvasElement>(null)
  const ref = useRevelar<HTMLDivElement>()

  useEffect(() => {
    const canvas = lienzo.current
    if (!canvas) return
    let detenido = false
    let raf = 0
    const contexto2d = canvas.getContext('2d')
    const t0 = performance.now()

    const respaldo = (): void => {
      if (!contexto2d) return
      const pintar = (): void => {
        if (detenido || !contexto2d) return
        const t = (performance.now() - t0) / 1000
        const { width: w, height: h } = canvas
        contexto2d.fillStyle = '#05070d'
        contexto2d.fillRect(0, 0, w, h)
        for (let i = 0; i < 5; i++) {
          contexto2d.beginPath()
          contexto2d.strokeStyle = i % 2 === 0 ? 'rgba(53,230,255,.85)' : 'rgba(139,92,255,.7)'
          contexto2d.lineWidth = 1.4
          for (let x = 0; x <= w; x += 6) {
            const y = h / 2 + Math.sin(x * 0.02 + t * (1.2 + i * 0.4) + i) * (10 + i * 14)
            if (x === 0) contexto2d.moveTo(x, y)
            else contexto2d.lineTo(x, y)
          }
          contexto2d.stroke()
        }
        raf = requestAnimationFrame(pintar)
      }
      pintar()
    }

    /* Si el equipo no ofrece aceleración gráfica se usa el trazo simple: misma idea, sin huecos. */
    const motor = (navigator as unknown as { gpu?: any }).gpu
    if (!motor) {
      respaldo()
      return () => {
        detenido = true
        cancelAnimationFrame(raf)
      }
    }
    void (async () => {
      try {
        const tarjeta = await motor.requestAdapter()
        if (!tarjeta) throw new Error('sin adaptador compatible')
        const dispositivo = await tarjeta.requestDevice()
        const formato = motor.getPreferredCanvasFormat()
        const contexto = (canvas as unknown as { getContext: (id: string) => any }).getContext('webgpu')
        if (!contexto) throw new Error('sin contexto disponible')
        contexto.configure({ device: dispositivo, format: formato, alphaMode: 'premultiplied' })

        const modulo = dispositivo.createShaderModule({ code: WGSL })
        const pipeline = dispositivo.createRenderPipeline({
          layout: 'auto',
          vertex: { module: modulo, entryPoint: 'vs' },
          fragment: { module: modulo, entryPoint: 'fs', targets: [{ format: formato }] },
          primitive: { topology: 'triangle-list' }
        })
        const uniformes = dispositivo.createBuffer({ size: 16, usage: 0x40 | 0x8 })
        const grupo = dispositivo.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniformes } }]
        })

        const pintar = (): void => {
          if (detenido) return
          const t = (performance.now() - t0) / 1000
          dispositivo.queue.writeBuffer(uniformes, 0, new Float32Array([t, 0, canvas.width, canvas.height]))
          const codificador = dispositivo.createCommandEncoder()
          const pase = codificador.beginRenderPass({
            colorAttachments: [
              {
                view: contexto.getCurrentTexture().createView(),
                clearValue: { r: 0, g: 0, b: 0, a: 1 },
                loadOp: 'clear',
                storeOp: 'store'
              }
            ]
          })
          pase.setPipeline(pipeline)
          pase.setBindGroup(0, grupo)
          pase.draw(3)
          pase.end()
          dispositivo.queue.submit([codificador.finish()])
          raf = requestAnimationFrame(pintar)
        }
        pintar()
      } catch {
        respaldo()
      }
    })()
    return () => {
      detenido = true
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="tarjeta">
        <canvas
          ref={lienzo}
          width={640}
          height={300}
          className="h-auto w-full rounded-lg"
          aria-label="Animación de la envolvente de señal alrededor de una antena"
        />
      </div>
      <div className="tarjeta">
        <h3 className="etiqueta">Cómo leer la animación</h3>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-suave">
          <li>
            <strong className="font-medium text-texto">Las crestas</strong> marcan los máximos de la envolvente: donde la
            señal llega con más energía.
          </li>
          <li>
            <strong className="font-medium text-texto">La separación entre crestas</strong> depende de la frecuencia: a
            mayor frecuencia, ondas más cortas y una zona de Fresnel más pequeña.
          </li>
          <li>
            <strong className="font-medium text-texto">La pérdida de amplitud</strong> hacia los bordes representa la
            atenuación en el espacio libre.
          </li>
        </ul>
        <p className="mt-4 border-t border-white/[0.07] pt-4 text-xs leading-relaxed text-suave">
          Es una representación didáctica del modelo de propagación, no una medición de campo. Los valores exactos salen
          del laboratorio de radioenlace.
        </p>
      </div>
    </div>
  )
}

