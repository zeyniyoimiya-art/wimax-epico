import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './estilos/global.css'
import App from './App'

const raiz = document.getElementById('raiz')
if (raiz) {
  createRoot(raiz).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

/* PWA: el service worker se registra sólo en producción (lo genera vite-plugin-pwa). */
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  void import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: false }))
}
