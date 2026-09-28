import { lazy, Suspense, useEffect, useState, type MouseEvent } from 'react'
import { DatoRapido, FichaDelTrabajo, Pildora, Seccion, TablaComparativa } from '../componentes/ui'
import { LineaTiempo, Laboratorio } from '../componentes/wimax'
import { Cobertura, DiagramaRed, PanelOndas } from '../componentes/wimax-diagramas'
import { Aprendizajes, Fuentes, Glosario, MapaBolivia, Personajes } from '../componentes/wimax-cierre'
import { ir, marcarSeccion } from '../enrutado'
import { destacada, entradas, fichaWimax } from '../datos/wimax'

const Lienzo = lazy(() => import('../componentes/lienzo'))

const INDICE = [
  { id: 'intro', texto: 'Introducción' },
  { id: 'que-es', texto: '¿Qué es WiMAX?' },
  { id: 'comparativa', texto: 'Wi-Fi contra WiMAX' },
  { id: 'especificaciones', texto: 'Ficha técnica' },
  { id: 'linea', texto: 'Línea de tiempo' },
  { id: 'laboratorio', texto: 'Laboratorio de señal' },
  { id: 'red', texto: 'Cómo funciona la red' },
  { id: 'cobertura', texto: 'Cobertura mundial' },
  { id: 'bolivia', texto: 'WiMAX en Bolivia' },
  { id: 'personajes', texto: 'Personajes' },
  { id: 'modelo', texto: 'El modelo, en vivo' },
  { id: 'aprendizajes', texto: 'Aprendizajes' },
  { id: 'glosario', texto: 'Glosario' },
  { id: 'fuentes', texto: 'Fuentes' }
]

/** Resalta en el índice la sección que se está leyendo. */
function usarSeccionActiva(): string {
  const [activa, setActiva] = useState(INDICE[0].id)
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) {
          setActiva(visible.target.id)
          marcarSeccion(visible.target.id)
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.3, 0.6] }
    )
    INDICE.forEach((entrada) => {
      const nodo = document.getElementById(entrada.id)
      if (nodo) observador.observe(nodo)
    })
    return () => observador.disconnect()
  }, [])
  return activa
}

export default function EntradaWimax() {
  const activa = usarSeccionActiva()
  const anterior = entradas[entradas.findIndex((e) => e.slug === fichaWimax.slug) + 1]

  const saltar = (id: string) => (ev: MouseEvent): void => {
    ev.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    marcarSeccion(id)
  }

  return (
    <article>
      <header className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-10 opacity-50">
          <Suspense fallback={null}>
            <Lienzo className="h-full w-full" />
          </Suspense>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-[5]"
          style={{
            background:
              'radial-gradient(130% 95% at 15% 0%, rgba(5,7,13,.34), rgba(5,7,13,.76) 55%, rgba(5,7,13,.96)), linear-gradient(180deg, rgba(5,7,13,.52), rgba(5,7,13,.94))'
          }}
        />
        <div className="mx-auto max-w-5xl px-4 pt-16 pb-14 sm:pt-24">
          <nav aria-label="Miga de pan" className="text-xs text-suave">
            <button className="hover:text-acento" onClick={() => ir('')}>
              Inicio
            </button>
            <span className="mx-2">/</span>
            <span>Entradas</span>
            <span className="mx-2">/</span>
            <span className="text-texto">WiMAX</span>
          </nav>

          <p className="etiqueta mt-6">Investigación destacada · {fichaWimax.fecha}</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] font-black tracking-tight sm:text-5xl">{fichaWimax.titulo}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-suave">{fichaWimax.resumen}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            <li className="chip">✍️ {fichaWimax.autor}</li>
            <li className="chip">⏱️ {destacada.minutos} min de lectura</li>
            {fichaWimax.etiquetas.map((etiqueta) => (
              <li key={etiqueta} className="chip">
                #{etiqueta}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            <button className="boton sombra-neon" onClick={saltar('que-es')}>
              Empezar a leer ↓
            </button>
            <button className="boton" onClick={() => ir('informe')}>
              📄 Leer el informe completo
            </button>
          </div>
        </div>
      </header>
      <details className="mx-auto mt-4 max-w-7xl px-4 lg:hidden">
        <summary className="boton inline-flex cursor-pointer">Índice de la entrada ({INDICE.length} secciones)</summary>
        <nav aria-label="Índice de secciones" className="tarjeta mt-3">
          <ul className="grid gap-1 text-sm sm:grid-cols-2">
            {INDICE.map((entrada) => (
              <li key={'movil-' + entrada.id}>
                <a
                  href={'#' + entrada.id}
                  onClick={saltar(entrada.id)}
                  className="block rounded-lg px-2.5 py-1.5 text-suave transition-colors hover:bg-white/5 hover:text-white"
                >
                  {entrada.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </details>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block">
          <nav aria-label="Índice de la entrada" className="sticky top-24">
            <p className="etiqueta">Índice</p>
            <ul className="mt-3 space-y-0.5 text-sm">
              {INDICE.map((entrada) => (
                <li key={entrada.id}>
                  <a
                    href={'#' + entrada.id}
                    onClick={saltar(entrada.id)}
                    className={
                      'block rounded-lg px-2.5 py-1.5 transition-colors ' +
                      (activa === entrada.id
                        ? 'bg-acento/10 font-semibold text-acento'
                        : 'text-suave hover:bg-white/5 hover:text-white')
                    }
                  >
                    {entrada.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          <Seccion id="intro" etiqueta="Introducción" titulo="¿Te acordás de WiMAX?">
            <div className="tarjeta border-l-4 border-l-acento">
              <p className="text-lg leading-relaxed italic">{fichaWimax.cita}</p>
            </div>
            <div className="mt-6 space-y-4 leading-relaxed text-suave">
              <p>
                Durante unos años, entre 2005 y 2010, WiMAX fue <strong className="text-texto">la palabra más repetida</strong>{' '}
                del mundo de las telecomunicaciones. Prometía banda ancha para ciudades enteras sin cavar una sola zanja:
                una antena en el techo del cliente y otra en lo alto de una torre bastaban para reemplazar al par de cobre.
              </p>
              <p>
                En Bolivia hubo anuncios, torres, proveedores internacionales y promesas de internet “desde cualquier lugar
                de la ciudad”. Esta investigación reconstruye esa historia: <strong className="text-texto">qué fue WiMAX</strong>,
                quiénes lo impulsaron, por qué terminó perdiendo contra LTE… y qué queda de todo aquello hoy.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DatoRapido etiqueta="Norma IEEE" valor="802.16" detalle="Familia de estándares para redes metropolitanas inalámbricas (WMAN)." />
              <DatoRapido etiqueta="Alcance típico" valor="3–10 km" detalle="Hasta ~50 km con línea de vista: cubría barrios y ciudades." />
              <DatoRapido etiqueta="Velocidad" valor="≈70 Mbps" detalle="Teórica por canal; decenas de Mbps en la práctica." />
              <DatoRapido etiqueta="Bolivia" valor="2008" detalle="Entel y VIVA anuncian redes comerciales Rev-e en el país." />
            </div>
          </Seccion>

          <Seccion
            id="que-es"
            etiqueta="Conceptos"
            titulo="¿Qué es WiMAX, en palabras simples?"
            descripcion="WiMAX (Worldwide Interoperability for Microwave Access) es el nombre comercial de los equipos certificados bajo la norma IEEE 802.16. En lugar de llevar cables hasta cada casa, instala antenas en torres y reparte internet por ondas de radio."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {fichaWimax.sabores.map((sabor) => (
                <article key={sabor.nombre} className="tarjeta">
                  <h3 className="text-lg font-black tracking-tight">{sabor.nombre}</h3>
                  <p className="mt-1 font-mono text-xs text-acento">{sabor.norma}</p>
                  <p className="mt-3 text-sm leading-relaxed text-suave">{sabor.texto}</p>
                </article>
              ))}
            </div>
            <div className="tarjeta mt-4">
              <h3 className="font-black tracking-tight">La intuición en tres pasos</h3>
              <ol className="mt-3 space-y-3 text-sm leading-relaxed text-suave">
                <li>
                  <strong className="text-texto">1.</strong> El operador instala una estación base en una torre alta, con
                  licencia de espectro.
                </li>
                <li>
                  <strong className="text-texto">2.</strong> El cliente monta una antena (CPE) apuntada a la torre, con
                  línea de vista libre.
                </li>
                <li>
                  <strong className="text-texto">3.</strong> La torre reparte el canal entre los clientes con OFDMA y
                  conecta al núcleo por backhaul.
                </li>
              </ol>
            </div>
          </Seccion>
          <Seccion
            id="comparativa"
            etiqueta="Comparación"
            titulo="Wi-Fi contra WiMAX: no eran rivales"
            descripcion="Es el malentendido más común de toda esta historia: Wi-Fi cubre una casa; WiMAX aspiraba a cubrir una ciudad. Uno resuelve la red local y el otro quería resolver la última milla."
          >
            <TablaComparativa filas={fichaWimax.comparativa} />
          </Seccion>

          <Seccion
            id="especificaciones"
            etiqueta="Ficha técnica"
            titulo="Especificaciones y evolución del estándar"
            descripcion="Del 802.16 original de 2001 al 802.16m de 2011: cada revisión empujó más velocidad, movilidad y eficiencia espectral."
            ancho="ancho"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fichaWimax.specs.map((spec) => (
                <DatoRapido key={spec.etiqueta} etiqueta={spec.etiqueta} valor={spec.valor} detalle={spec.detalle} />
              ))}
            </div>
            <p className="mt-4 flex flex-wrap gap-2">
              {['802.16 (2001)', '802.16-2004 · fijo', '802.16e-2005 · móvil', '802.16m (2011) · WiMAX 2'].map((norma) => (
                <Pildora key={norma}>{norma}</Pildora>
              ))}
            </p>
          </Seccion>

          <Seccion
            id="linea"
            etiqueta="Historia"
            titulo="Línea de tiempo: del laboratorio al olvido"
            descripcion="Tocá cada año para recorrer los hitos que marcaron la vida de la tecnología, desde el grupo de trabajo de la IEEE hasta sus nichos actuales."
            ancho="ancho"
          >
            <LineaTiempo hitos={fichaWimax.linea} />
          </Seccion>

          <Seccion
            id="laboratorio"
            etiqueta="Laboratorio"
            titulo="Calculá la zona de Fresnel de un enlace"
            descripcion="Acá la investigación se vuelve herramienta: movés las distancias y la frecuencia, y el blog resuelve el elipsoide de Fresnel que la señal necesita para viajar limpia. Todo con sus fórmulas y unidades a la vista, para poder repetir el cálculo en papel."
            ancho="ancho"
          >
            <Laboratorio />
          </Seccion>

          <Seccion
            id="red"
            etiqueta="Arquitectura"
            titulo="Cómo funciona una red WiMAX, paso a paso"
            descripcion="Del equipo del usuario hasta Internet: seis saltos que explican por qué la señal llegaba a tu casa sin ningún cable en el medio."
            ancho="ancho"
          >
            <DiagramaRed />
          </Seccion>

          <Seccion
            id="cobertura"
            etiqueta="Mapa mundial"
            titulo="Dónde se desplegó WiMAX en el mundo"
            descripcion="Corea del Sur fue la primera, Chile el despliegue más grande de Latinoamérica, y Bolivia apareció en el mapa entre 2004 y 2009."
            ancho="ancho"
          >
            <Cobertura paises={fichaWimax.paises} />
          </Seccion>
          <Seccion
            id="bolivia"
            etiqueta="Bolivia"
            titulo="WiMAX en Bolivia: Entel, VIVA y COTAS"
            descripcion="No fuimos espectadores. Entre 2004 y 2009 se documentaron despliegues en Santa Cruz, La Paz, El Alto y Cochabamba, con proveedores internacionales como Alcatel-Lucent, ZyXEL, Airspan y Alvarion."
            ancho="ancho"
          >
            <MapaBolivia
              hitos={fichaWimax.hitosBolivia}
              empresas={fichaWimax.empresas}
              proveedores={fichaWimax.proveedores}
              regulador={fichaWimax.regulador}
            />
          </Seccion>

          <Seccion
            id="personajes"
            etiqueta="Personajes"
            titulo="Las personas detrás de la tecnología"
            descripcion="Un estándar no lo hace una empresa sola: lo hacen ingenieros, directivos y voceros que empujan (o abandonan) una idea. Filtrá entre las figuras internacionales y las bolivianas."
            ancho="ancho"
          >
            <Personajes personajes={fichaWimax.personajes} />
          </Seccion>

          <Seccion
            id="modelo"
            etiqueta="Visualización"
            titulo="El modelo de propagación, en vivo"
            descripcion="Una animación del campo de ondas que rodea a la antena: la envolvente se calcula en tiempo real para mostrar cómo la señal se atenúa con la distancia y por qué la frecuencia cambia el tamaño de la zona despejada."
            ancho="ancho"
          >
            <PanelOndas />
            <div className="mt-6">
              <FichaDelTrabajo />
            </div>
          </Seccion>

          <Seccion
            id="aprendizajes"
            etiqueta="Conclusiones"
            titulo="Tres aprendizajes que me llevo"
            descripcion="Más allá del estándar, esta investigación deja lecciones sobre cómo se adopta (y se abandona) una innovación."
            ancho="ancho"
          >
            <Aprendizajes aprendizajes={fichaWimax.aprendizajes} pendiente={fichaWimax.pendiente} />
          </Seccion>

          <Seccion
            id="glosario"
            etiqueta="Glosario"
            titulo="Los términos que conviene saber"
            descripcion="Buscá cualquier palabra: 802.16, Fresnel, backhaul, OFDMA, AeroMACS… todo explicado en una línea, sin jerga innecesaria."
            ancho="ancho"
          >
            <Glosario terminos={fichaWimax.glosario} />
          </Seccion>

          <Seccion
            id="fuentes"
            etiqueta="Referencias"
            titulo="Fuentes consultadas"
            descripcion="Toda investigación seria se puede verificar: acá están los enlaces y documentos que sostienen cada afirmación de esta entrada."
            ancho="ancho"
          >
            <Fuentes fuentes={fichaWimax.fuentes} />
          </Seccion>

          <section className="mt-12 border-t border-white/10 pt-8">
            <div className="tarjeta flex flex-wrap items-center gap-4">
              <div>
                <p className="etiqueta">Fin de la entrada</p>
                <p className="mt-1 font-black tracking-tight">Gracias por leer hasta acá 🙌</p>
                <p className="mt-1 text-sm text-suave">
                  Escrita por {fichaWimax.autor} · {fichaWimax.fecha} · El Alto, Bolivia
                </p>
              </div>
              <div className="ml-auto flex flex-wrap gap-2">
                <a className="boton" href="informe/red-wimax.md" download>
                  ⤓ Descargar el informe (.md)
                </a>
                <button className="boton" onClick={() => ir('informe')}>
                  📄 Ver informe completo
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button className="tarjeta text-left" onClick={() => ir('')}>
                <p className="etiqueta">Volver</p>
                <p className="mt-1 font-bold">← Todas las entradas</p>
              </button>
              {anterior && (
                <button className="tarjeta text-left" onClick={() => ir('entrada/' + anterior.slug)}>
                  <p className="etiqueta">Siguiente lectura</p>
                  <p className="mt-1 font-bold">
                    {anterior.emoji} {anterior.titulo} →
                  </p>
                </button>
              )}
            </div>
          </section>



        </div>
      </div>

    </article>
  )
}
