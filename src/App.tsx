import type { ReactNode } from 'react'
import { AvisoErrores, Barra, BotonArriba, Cursor, Pie, Progreso, usarAudioReactivo, usarAvisos } from './componentes/interfaz'
import { ir, usarRuta } from './enrutado'
import { entradas } from './datos/wimax'
import type { Entrada } from './datos/esquemas'
import Inicio from './paginas/Inicio'
import EntradaWimax from './paginas/EntradaWimax'
import { PaginaInforme, PaginaNoEncontrada, PaginaSobreMi } from './paginas/Simples'

/** Página para las entradas anunciadas pero aún no escritas. */
function EnPreparacion({ entrada }: { entrada: Entrada }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-5xl" aria-hidden="true">
        {entrada.emoji}
      </p>
      <p className="etiqueta mt-6">En preparación</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{entrada.titulo}</h1>
      <p className="mt-4 leading-relaxed text-suave">{entrada.resumen}</p>
      <p className="mt-4 font-mono text-xs text-suave">
        Publicación prevista: {entrada.fecha} · {entrada.minutos} min de lectura
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <button className="boton sombra-neon" onClick={() => ir('entrada/red-wimax')}>
          📡 Mientras tanto: leer la investigación WiMAX
        </button>
        <button className="boton" onClick={() => ir('')}>
          ← Volver al inicio
        </button>
      </div>
    </article>
  )
}

export default function App() {
  const ruta = usarRuta()
  usarAvisos()
  usarAudioReactivo()

  let contenido: ReactNode
  if (ruta.nombre === 'inicio') {
    contenido = <Inicio />
  } else if (ruta.nombre === 'informe') {
    contenido = <PaginaInforme />
  } else if (ruta.nombre === 'entrada') {
    const entrada = entradas.find((e) => e.slug === ruta.slug)
    if (ruta.slug === 'red-wimax') contenido = <EntradaWimax />
    else if (ruta.slug === 'sobre-mi') contenido = <PaginaSobreMi />
    else if (entrada) contenido = <EnPreparacion entrada={entrada} />
    else contenido = <PaginaNoEncontrada destino={'entrada/' + ruta.slug} />
  } else {
    contenido = <PaginaNoEncontrada destino={ruta.destino} />
  }

  return (
    <>
      <Progreso />
      <Barra />
      <Cursor />
      <main id="contenido">{contenido}</main>
      <Pie />
      <BotonArriba />
      <AvisoErrores />
    </>
  )
}
