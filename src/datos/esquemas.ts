import { z } from 'zod'

/* ═══════════════ ESQUEMAS (validación tipada con Zod) ═══════════════ */

export const esquemaHito = z.object({
  anio: z.string().min(3),
  titulo: z.string().min(3),
  texto: z.string().min(15),
  emoji: z.string().default('•'),
  tono: z.enum(['base', 'auge', 'caida', 'bolivia']).default('base')
})

export const esquemaComparativa = z.object({
  criterio: z.string().min(3),
  wifi: z.string().min(1),
  wimax: z.string().min(1),
  destaca: z.boolean().default(false)
})

export const esquemaSpec = z.object({ etiqueta: z.string(), valor: z.string(), detalle: z.string() })

export const esquemaPersonaje = z.object({
  nombre: z.string().min(3),
  bandera: z.string().default('🌎'),
  rol: z.string().min(3),
  texto: z.string().min(20),
  boliviano: z.boolean().default(false)
})

export const esquemaPais = z.object({
  bandera: z.string(),
  pais: z.string().min(3),
  operador: z.string().min(2),
  anio: z.string().min(4),
  detalle: z.string().min(15),
  fuerza: z.number().min(0).max(100).default(50)
})

export const esquemaEmpresa = z.object({
  empresa: z.string().min(2),
  rol: z.string().min(3),
  tecnologia: z.string().min(3),
  proveedor: z.string().min(2),
  zona: z.string().min(3),
  anio: z.string().min(4)
})

export const esquemaHitoBolivia = z.object({
  titulo: z.string().min(5),
  anio: z.string().min(4),
  texto: z.string().min(30),
  emoji: z.string().default('🇧🇴')
})

export const esquemaTermino = z.object({
  termino: z.string().min(2),
  definicion: z.string().min(15),
  etiquetas: z.array(z.string()).default([])
})

export const esquemaFuente = z.object({
  titulo: z.string().min(5),
  medio: z.string().min(3),
  url: z.url().optional(),
  bloque: z.enum(['general', 'auge', 'bolivia'])
})

export const esquemaFicha = z.object({
  slug: z.string().min(3),
  titulo: z.string().min(5),
  resumen: z.string().min(30),
  cita: z.string().min(30),
  fecha: z.string().min(4),
  autor: z.string().min(5),
  etiquetas: z.array(z.string()).min(1),
  comparativa: z.array(esquemaComparativa).min(3),
  specs: z.array(esquemaSpec).min(3),
  sabores: z.array(z.object({ nombre: z.string(), norma: z.string(), texto: z.string() })).min(2),
  linea: z.array(esquemaHito).min(5),
  personajes: z.array(esquemaPersonaje).min(3),
  paises: z.array(esquemaPais).min(4),
  hitosBolivia: z.array(esquemaHitoBolivia).min(3),
  empresas: z.array(esquemaEmpresa).min(2),
  proveedores: z.array(z.string()).min(3),
  regulador: z.string().min(10),
  aprendizajes: z.array(z.string().min(30)).min(3),
  glosario: z.array(esquemaTermino).min(6),
  fuentes: z.array(esquemaFuente).min(6),
  pendiente: z.string().optional()
})

export type Hito = z.infer<typeof esquemaHito>
export type Comparativa = z.infer<typeof esquemaComparativa>
export type Spec = z.infer<typeof esquemaSpec>
export type Personaje = z.infer<typeof esquemaPersonaje>
export type Pais = z.infer<typeof esquemaPais>
export type Empresa = z.infer<typeof esquemaEmpresa>
export type HitoBolivia = z.infer<typeof esquemaHitoBolivia>
export type Termino = z.infer<typeof esquemaTermino>
export type Fuente = z.infer<typeof esquemaFuente>
export type Ficha = z.infer<typeof esquemaFicha>

export const esquemaEntrada = z.object({
  slug: z.string().min(3),
  titulo: z.string().min(5),
  resumen: z.string().min(20),
  fecha: z.string().min(4),
  etiquetas: z.array(z.string()).min(1),
  emoji: z.string().default('📄'),
  destacada: z.boolean().default(false),
  minutos: z.number().int().min(1)
})

export type Entrada = z.infer<typeof esquemaEntrada>

export const esquemaSobreMi = z.object({
  titulo: z.string(),
  parrafos: z.array(z.string().min(40)).min(3),
  gustos: z.array(z.object({ titulo: z.string(), texto: z.string(), emoji: z.string() })).min(3),
  datos: z.array(z.object({ clave: z.string(), valor: z.string() })).min(4)
})
