import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type EstadoBlog = {
  seccionActual: string
  cursorActivo: boolean
  sonidoActivo: boolean
  errores: string[]
  fijarSeccion: (id: string) => void
  alternarCursor: () => void
  marcarSonido: (activo: boolean) => void
  agregarError: (texto: string) => void
  limpiarErrores: () => void
}

export const usarBlog = create<EstadoBlog>()(
  persist(
    (set) => ({
      seccionActual: 'inicio',
      cursorActivo: true,
      sonidoActivo: false,
      errores: [],
      fijarSeccion: (id) => set({ seccionActual: id }),
      alternarCursor: () => set((s) => ({ cursorActivo: !s.cursorActivo })),
      marcarSonido: (activo) => set({ sonidoActivo: activo }),
      agregarError: (texto) => set((s) => ({ errores: [texto, ...s.errores].slice(0, 5) })),
      limpiarErrores: () => set({ errores: [] })
    }),
    { name: 'zenithspace-v3' }
  )
)
