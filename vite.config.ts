import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // rutas relativas: funcionan en local, en un subdirectorio y en GitHub Pages
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icono-192.png', 'icono-512.png'],
      manifest: {
        name: 'ZenithSpace · Investigaciones de Redes',
        short_name: 'ZenithSpace',
        description:
          'Cuaderno de investigaciones de la materia de Redes: WiMAX, telecomunicaciones y su historia en Bolivia.',
        lang: 'es',
        theme_color: '#0a0a0c',
        background_color: '#0a0a0c',
        display: 'standalone',
        orientation: 'any',
        start_url: './',
        icons: [
          { src: './icono-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: './icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: './icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,md,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html'
      },
      devOptions: { enabled: false }
    })
  ],
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          tres: ['three', '@react-three/fiber', '@react-three/drei'],
          anim: ['gsap', 'motion', 'lottie-web'],
          texto: ['marked'],
          datos: ['zod', '@tanstack/react-query', 'zustand', 'react-hook-form', '@hookform/resolvers']
        }
      }
    }
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})
