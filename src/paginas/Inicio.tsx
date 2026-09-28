import { lazy, Suspense } from 'react'
import { DatoRapido, FichaDelTrabajo, Seccion } from '../componentes/ui'
import { ir } from '../enrutado'
import { destacada, entradas, fichaWimax, sobreMi } from '../datos/wimax'

const Lienzo = lazy(() => import('../componentes/lienzo'))

const SELLOS = ['Redes de computadoras', 'Investigación documental', 'Fuentes verificables', 'El Alto · Bolivia']

export default function Inicio() {
  const proximas = entradas.filter((entrada) => entrada.slug !== destacada.slug && entrada.slug !== 'sobre-mi')

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-55">
          <Suspense fallback={null}>
            <Lienzo className="h-full w-full" />
          </Suspense>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-[5]"
          style={{
            background:
              'radial-gradient(130% 90% at 18% 0%, rgba(5,7,13,.3), rgba(5,7,13,.72) 55%, rgba(5,7,13,.95)), linear-gradient(180deg, rgba(5,7,13,.5), rgba(5,7,13,.92))'
          }}
        />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-28">
          <p className="etiqueta aparecer">ZenithSpace · cuaderno de Redes</p>
          <h1 className="aparecer mt-4 max-w-3xl text-5xl leading-[1.02] font-black tracking-tight sm:text-6xl">
            Investigaciones de <span className="titulo-gradiente">redes</span>,
            <br />
            contadas como se merecen.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-suave">
            Soy <strong className="text-texto">Josué Salomón</strong> (El Alto, Bolivia 🇧🇴). Publico aquí los trabajos de
            investigación de la materia de Redes: qué se estudió, con qué fuentes y cómo se puede verificar cada dato.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="boton sombra-neon" onClick={() => ir('entrada/' + destacada.slug)}>
              📡 Leer la investigación destacada
            </button>
            <button
              className="boton"
              onClick={() => document.getElementById('entradas')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver todas las entradas ↓
            </button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {SELLOS.map((sello) => (
              <li key={sello} className="chip">
                {sello}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Seccion
        id="destacada"
        etiqueta="Entrada destacada"
        titulo="WiMAX: la promesa inalámbrica que llegó a Bolivia"
        descripcion="La investigación completa: del grupo de trabajo de la IEEE en 1999 a las redes Rev-e de Entel y VIVA en 2008, con línea de tiempo, laboratorio de radioenlace, mapa mundial y glosario."
        ancho="ancho"
      >
        <article className="tarjeta grid gap-6 border-acento/35 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip border-acento/60 text-acento">📡 Investigación destacada</span>
              <span className="chip font-mono">{destacada.fecha}</span>
              <span className="chip">⏱️ {destacada.minutos} min</span>
            </div>
            <h3 className="mt-4 text-2xl font-black tracking-tight">{destacada.titulo}</h3>
            <p className="mt-3 leading-relaxed text-suave">{destacada.resumen}</p>
            <p className="mt-4 border-l-4 border-l-acento/60 pl-4 leading-relaxed text-texto/90 italic">
              {fichaWimax.cita}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button className="boton sombra-neon" onClick={() => ir('entrada/' + destacada.slug)}>
                Entrar a la investigación
              </button>
              <button className="boton" onClick={() => ir('informe')}>
                📄 Leer el informe íntegro
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <h3 className="text-sm font-black tracking-wider text-acento uppercase">Qué vas a encontrar</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-suave">
              <li>
                <strong className="text-white">La historia completa.</strong> {fichaWimax.linea.length} hitos fechados,
                desde el estándar original hasta los despliegues bolivianos.
              </li>
              <li>
                <strong className="text-white">Los protagonistas.</strong> {fichaWimax.personajes.length} personajes,
                incluidos los ingenieros bolivianos que impulsaron las redes locales.
              </li>
              <li>
                <strong className="text-white">El laboratorio.</strong> Cálculo del radio de Fresnel para entender por
                qué la línea de vista decide si hay enlace.
              </li>
              <li>
                <strong className="text-white">Las fuentes.</strong> {fichaWimax.fuentes.length} referencias al pie para
                que cualquiera pueda seguir la pista.
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {fichaWimax.etiquetas.map((etiqueta) => (
                <span key={etiqueta} className="chip">
                  #{etiqueta}
                </span>
              ))}
            </div>
          </div>
        </article>
      </Seccion>

      <Seccion
        id="entradas"
        etiqueta="Índice"
        titulo="Todas las entradas"
        descripcion="Cada tema se publica como una investigación aparte, con su propio informe descargable."
        ancho="ancho"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entradas.map((entrada) => (
            <article key={entrada.slug} className="tarjeta flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {entrada.emoji}
                </span>
                <span className="font-mono text-xs text-suave">⏱️ {entrada.minutos} min</span>
              </div>
              <h3 className="mt-3 text-lg font-black tracking-tight">{entrada.titulo}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-suave">{entrada.resumen}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {entrada.etiquetas.map((etiqueta) => (
                  <li key={etiqueta} className="chip">
                    #{etiqueta}
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-white/10 pt-4">
                {entrada.slug === 'red-wimax' || entrada.slug === 'sobre-mi' ? (
                  <button className="boton w-full" onClick={() => ir('entrada/' + entrada.slug)}>
                    Leer entrada →
                  </button>
                ) : (
                  <p className="font-mono text-xs text-suave">⏳ En preparación · {entrada.fecha}</p>
                )}
              </div>
            </article>
          ))}
        </div>
        {proximas.length > 0 && (
          <p className="mt-4 text-xs leading-relaxed text-suave">
            Las entradas en preparación siguen la misma estructura: contexto, datos verificables, un material de estudio
            y las fuentes al final. Se publican a medida que avanzo con el bimestre.
          </p>
        )}
      </Seccion>

      <Seccion
        id="investigacion"
        etiqueta="Sobre el trabajo"
        titulo="Cómo está hecha esta investigación"
        descripcion="Cada entrada se arma como un informe: contexto, datos comprobables y un material de estudio que se puede repetir."
        ancho="ancho"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DatoRapido
            etiqueta="Hitos fechados"
            valor={String(fichaWimax.linea.length)}
            detalle="De 1999 a hoy, con fechas y protagonistas identificados."
          />
          <DatoRapido
            etiqueta="Personajes"
            valor={String(fichaWimax.personajes.length)}
            detalle="Incluye a los bolivianos que impulsaron las redes locales."
          />
          <DatoRapido
            etiqueta="Países relevados"
            valor={String(fichaWimax.paises.length)}
            detalle="Despliegues documentados alrededor del mundo."
          />
          <DatoRapido
            etiqueta="Fuentes"
            valor={String(fichaWimax.fuentes.length)}
            detalle="Enlaces verificables más notas de prensa de la época."
          />
        </div>
        <div className="mt-6">
          <FichaDelTrabajo />
        </div>
      </Seccion>

      <Seccion id="blog" etiqueta="El blog" titulo="¿Quién escribe ZenithSpace?" ancho="ancho">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="tarjeta">
            {sobreMi.parrafos.map((parrafo) => (
              <p key={parrafo.slice(0, 20)} className="mb-3 leading-relaxed text-suave last:mb-0">
                {parrafo}
              </p>
            ))}
            <button className="boton mt-5" onClick={() => ir('entrada/sobre-mi')}>
              Leer la entrada completa →
            </button>
          </div>
          <div className="tarjeta">
            <h3 className="etiqueta">Ficha rápida</h3>
            <dl className="mt-4 space-y-2.5 text-sm">
              {sobreMi.datos.map((dato) => (
                <div key={dato.clave} className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 last:border-0">
                  <dt className="font-semibold text-suave">{dato.clave}</dt>
                  <dd className="text-right font-mono text-xs">{dato.valor}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-5 space-y-2">
              {sobreMi.gustos.map((gusto) => (
                <li key={gusto.titulo} className="flex items-start gap-3 text-sm">
                  <span aria-hidden="true">{gusto.emoji}</span>
                  <span>
                    <strong className="block">{gusto.titulo}</strong>
                    <span className="text-suave">{gusto.texto}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Seccion>
    </>
  )
}
