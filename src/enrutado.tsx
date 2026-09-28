import { useEffect, useState } from 'react'
import { conTransicion } from './lib/plataforma'

/**
 * Router propio (sin dependencias) sobre hash: funciona en local, en un
 * subdirectorio y en GitHub Pages sin configurar nada. Las secciones se
 * reflejan en la URL con ?s=… así se puede compartir el enlace exacto.
 */
export type Ruta =
  | { nombre: 'inicio'; seccion?: string }
  | { nombre: 'entrada'; slug: string; seccion?: string }
  | { nombre: 'informe'; seccion?: string }
  | { nombre: 'no-encontrada'; destino: string }

export function leerRuta(): Ruta {
  const completo = window.location.hash
  // cualquier hash que no sea una ruta (por ejemplo el ancla #contenido) no cambia de página
  if (!completo.startsWith('#/')) return { nombre: 'inicio' }
  const crudo = completo.slice(2)
  const [camino, consulta] = crudo.split('?')
  const partes = camino.split('/').filter(Boolean)
  const seccion = new URLSearchParams(consulta ?? '').get('s') ?? undefined
  if (partes.length === 0) return { nombre: 'inicio', seccion }
  if (partes[0] === 'informe') return { nombre: 'informe', seccion }
  if (partes[0] === 'entrada' && partes[1]) return { nombre: 'entrada', slug: decodeURIComponent(partes[1]), seccion }
  return { nombre: 'no-encontrada', destino: camino }
}

export function enlace(ruta: string, seccion?: string): string {
  const limpio = ruta.replace(/^#?\/?/, '')
  return '#/' + limpio + (seccion ? '?s=' + encodeURIComponent(seccion) : '')
}

/** Navega entre páginas usando View Transitions cuando el navegador lo soporta. */
export function ir(ruta: string, seccion?: string): void {
  conTransicion(() => {
    window.location.hash = enlace(ruta, seccion)
  })
}

/** Marca en la URL la sección visible (para poder compartir el enlace). */
export function marcarSeccion(seccion: string): void {
  const ruta = leerRuta()
  let camino = ''
  if (ruta.nombre === 'entrada') camino = 'entrada/' + ruta.slug
  else if (ruta.nombre === 'informe') camino = 'informe'
  const nuevo = '#/' + camino + (seccion ? '?s=' + encodeURIComponent(seccion) : '')
  if (window.location.hash !== nuevo) history.replaceState(null, '', nuevo)
}
export function usarRuta(): Ruta {
  const [ruta, setRuta] = useState<Ruta>(() => leerRuta())
  useEffect(() => {
    const alCambiar = (): void => {
      // los anclas internos (#contenido, #fuentes…) no son rutas: no cambian de página
      if (!window.location.hash.startsWith('#/')) return
      const siguiente = leerRuta()
      setRuta(siguiente)
      const seccion = 'seccion' in siguiente ? siguiente.seccion : undefined
      requestAnimationFrame(() => {
        if (seccion) {
          const el = document.getElementById(seccion)
          if (el) {
            el.scrollIntoView({ block: 'start' })
            return
          }
        }
        window.scrollTo({ top: 0 })
      })
    }
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])
  return ruta
}

/** Ancla interna: navega suave a una sección sin recargar la página. */
export function usarAncla(): (id: string) => (ev: React.MouseEvent) => void {
  return (id: string) => (ev: React.MouseEvent) => {
    ev.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    marcarSeccion(id)
  }
}
