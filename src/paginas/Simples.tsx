import { useEffect, useState } from 'react'
import { marked } from 'marked'
import { ir } from '../enrutado'
import { sobreMi } from '../datos/wimax'
import { FichaDelTrabajo, Seccion } from '../componentes/ui'

/* ═══════════ SOBRE MÍ ═══════════ */
export function PaginaSobreMi() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16">
      <p className="etiqueta">Personal · {sobreMi.datos[0]?.valor}</p>
      <h1 className="mt-3 text-4xl leading-tight font-black tracking-tight sm:text-5xl">🌙 Sobre mí</h1>

      <div className="mt-8 space-y-4 text-lg leading-relaxed text-suave">
        {sobreMi.parrafos.map((parrafo) => (
          <p key={parrafo.slice(0, 20)}>{parrafo}</p>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {sobreMi.gustos.map((gusto) => (
          <article key={gusto.titulo} className="tarjeta">
            <span className="text-2xl" aria-hidden="true">
              {gusto.emoji}
            </span>
            <h2 className="mt-2 font-black tracking-tight">{gusto.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-suave">{gusto.texto}</p>
          </article>
        ))}
      </div>

      <div className="tarjeta mt-6">
        <h2 className="etiqueta">Ficha rápida</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {sobreMi.datos.map((dato) => (
            <div key={dato.clave} className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
              <dt className="text-xs tracking-wider text-suave uppercase">{dato.clave}</dt>
              <dd className="mt-0.5 font-mono text-sm">{dato.valor}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button className="boton" onClick={() => ir('')}>
          ← Volver al inicio
        </button>
        <button className="boton sombra-neon" onClick={() => ir('entrada/red-wimax')}>
          📡 Leer la investigación sobre WiMAX
        </button>
      </div>

      <div className="mt-12">
        <FichaDelTrabajo />
      </div>
    </article>
  )
}

/* ═══════════ 404 · SEÑAL PERDIDA ═══════════ */
export function PaginaNoEncontrada({ destino }: { destino: string }) {
  return (
    <Seccion
      id="no-encontrada"
      etiqueta="Error 404"
      titulo="Se perdió la señal 📡"
      descripcion="La página que buscás no existe (o cambió de dirección). Como en WiMAX: si no hay línea de vista, no hay enlace."
    >
      <div className="tarjeta">
        <p className="font-mono text-xs text-suave">Ruta solicitada: /{destino}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button className="boton sombra-neon" onClick={() => ir('')}>
            🏠 Ir al inicio
          </button>
          <button className="boton" onClick={() => ir('entrada/' + 'red-wimax')}>
            📡 Ver la investigación WiMAX
          </button>
          <button className="boton" onClick={() => ir('informe')}>
            📄 Leer el informe
          </button>
        </div>
      </div>
    </Seccion>
  )
}
/* ═══════════ INFORME COMPLETO (markdown renderizado) ═══════════ */
/** Quita etiquetas peligrosas del markdown antes de inyectarlo. */
function limpiarHtml(html: string): string {
  const documento = new DOMParser().parseFromString(html, 'text/html')
  documento.querySelectorAll('script, style, iframe, object, embed, link, meta, form').forEach((nodo) => nodo.remove())
  documento.body.querySelectorAll('*').forEach((nodo) => {
    Array.from(nodo.attributes).forEach((atributo) => {
      const nombre = atributo.name.toLowerCase()
      const valor = atributo.value.trim().toLowerCase()
      if (nombre.startsWith('on') || ((nombre === 'href' || nombre === 'src') && valor.startsWith('javascript:'))) {
        nodo.removeAttribute(atributo.name)
      }
    })
  })
  return documento.body.innerHTML
}

export function PaginaInforme() {
  const [html, setHtml] = useState('')
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'error'>('cargando')

  useEffect(() => {
    let vivo = true
    fetch('informe/red-wimax.md')
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('respuesta ' + respuesta.status)
        return respuesta.text()
      })
      .then((texto) => {
        if (!vivo) return
        setHtml(limpiarHtml(marked.parse(texto, { async: false }) as string))
        setEstado('listo')
      })
      .catch(() => {
        if (vivo) setEstado('error')
      })
    return () => {
      vivo = false
    }
  }, [])

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <p className="etiqueta">Informe completo</p>
      <h1 className="mt-3 text-4xl leading-tight font-black tracking-tight sm:text-5xl">Red WiMAX · informe íntegro</h1>
      <p className="mt-4 leading-relaxed text-suave">
        Esta es la versión de lectura del trabajo original, tal como se entregó. La entrada interactiva completa (con
        laboratorio de señal, mapas y glosario) está{' '}
        <button className="enlace" onClick={() => ir('entrada/red-wimax')}>
          acá
        </button>
        .
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <a className="boton sombra-neon" href="informe/red-wimax.md" download>
          ⤓ Descargar (.md)
        </a>
        <a className="boton" href="informe/red-wimax.md" target="_blank" rel="noreferrer">
          Abrir en una pestaña ↗
        </a>
      </div>

      <div className="tarjeta mt-8">
        {estado === 'cargando' && <p className="text-sm text-suave">Cargando el informe…</p>}
        {estado === 'error' && (
          <p className="text-sm text-alerta">
            No se pudo cargar el informe desde <code>informe/red-wimax.md</code>. Podés descargarlo con el botón de
            arriba: el archivo siempre viaja con el sitio.
          </p>
        )}
        {estado === 'listo' && (
          <div
            className="prosa max-w-none text-sm leading-relaxed text-suave [&_a]:text-acento [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-acento/50 [&_blockquote]:pl-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-texto [&_h3]:mt-6 [&_h3]:font-bold [&_h3]:text-texto [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_strong]:text-texto [&_table]:my-4 [&_table]:w-full [&_td]:border [&_td]:border-white/10 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-white/10 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:text-texto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </article>
  )
}

