/**
 * Genera los iconos PNG de la PWA (192 y 512) escribiendo el PNG a mano:
 * cabecera + IHDR + IDAT (deflate con zlib) + IEND. Sin dependencias.
 *
 *   node scripts/generar_iconos.mjs
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const aqui = dirname(fileURLToPath(import.meta.url))
const salida = join(aqui, '..', 'public')

/* ── CRC32 para los segmentos PNG ── */
const TABLA_CRC = (() => {
  const tabla = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    tabla[n] = c >>> 0
  }
  return tabla
})()

function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) c = TABLA_CRC[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function segmento(tipo, datos) {
  const largo = Buffer.alloc(4)
  largo.writeUInt32BE(datos.length, 0)
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(cuerpo), 0)
  return Buffer.concat([largo, cuerpo, crc])
}

/** Escribe un PNG RGBA a partir de una función (x, y) → [r, g, b, a]. */
function crearPng(ancho, alto, colorDe) {
  const filas = []
  for (let y = 0; y < alto; y++) {
    const fila = Buffer.alloc(1 + ancho * 4)
    fila[0] = 0 // sin filtro
    for (let x = 0; x < ancho; x++) {
      const [r, g, b, a] = colorDe(x, y)
      const o = 1 + x * 4
      fila[o] = r
      fila[o + 1] = g
      fila[o + 2] = b
      fila[o + 3] = a
    }
    filas.push(fila)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(ancho, 0)
  ihdr.writeUInt32BE(alto, 4)
  ihdr[8] = 8 // bits por canal
  ihdr[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    segmento('IHDR', ihdr),
    segmento('IDAT', deflateSync(Buffer.concat(filas), { level: 9 })),
    segmento('IEND', Buffer.alloc(0))
  ])
}

/* ── dibujo del icono: torre + ondas + halo ── */
const MEZCLA = (base, capa, alfa) => Math.round(base + (capa - base) * alfa)

function dibujar(tamaño) {
  const cx = tamaño * 0.5
  const base = tamaño * 0.82
  const baliza = tamaño * 0.3
  const radioMastil = tamaño * 0.022
  const halo = tamaño * 0.03

  return (x, y) => {
    let r = 5
    let g = 7
    let b = 13

    // halo radial de fondo
    const distancia = Math.hypot(x - cx, y - base)
    const brilloFondo = Math.max(0, 1 - distancia / (tamaño * 0.75))
    r = MEZCLA(r, 40, brilloFondo * 0.85)
    g = MEZCLA(g, 130, brilloFondo * 0.85)
    b = MEZCLA(b, 170, brilloFondo * 0.85)

    // arcos de señal (sólo hacia arriba)
    for (let i = 1; i <= 3; i++) {
      const radio = tamaño * (0.16 + i * 0.13)
      const grosor = tamaño * 0.019
      if (y <= baliza + radio * 0.05 && Math.abs(distancia - radio) < grosor) {
        const intensidad = 1 - (i - 1) * 0.28
        const alfa = Math.max(0, Math.min(1, (distancia - radio) / grosor * 0 + 1)) * intensidad
        r = MEZCLA(r, 53, alfa)
        g = MEZCLA(g, 230, alfa)
        b = MEZCLA(b, 255, alfa)
      }
    }

    // mástil
    if (Math.abs(x - cx) < radioMastil && y >= baliza && y <= base + tamaño * 0.06) {
      r = 233
      g = 238
      b = 251
    }

    // baliza superior (rojo)
    if (Math.hypot(x - cx, y - baliza) < halo * 1.25) {
      r = 255
      g = 77
      b = 109
    }

    // base / suelo
    if (y > base + tamaño * 0.06 && y < base + tamaño * 0.06 + tamaño * 0.03 && Math.abs(x - cx) < tamaño * 0.16) {
      r = MEZCLA(r, 53, 0.85)
      g = MEZCLA(g, 230, 0.85)
      b = MEZCLA(b, 255, 0.85)
    }

    return [r, g, b, 255]
  }
}

mkdirSync(salida, { recursive: true })
for (const tamaño of [192, 512]) {
  const archivo = join(salida, `icono-${tamaño}.png`)
  writeFileSync(archivo, crearPng(tamaño, tamaño, dibujar(tamaño)))
  console.log(`   [OK] ${archivo}`)
}
console.log('   iconos PWA generados (192 y 512, RGBA, sin dependencias)')
