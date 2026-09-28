# ZenithSpace · blog épico de investigaciones

Blog personal de **Calle Cucho Josué Salomón** (INCOS · El Alto, Bolivia 🇧🇴) donde cada trabajo del bimestre
se publica como una **investigación interactiva** en vez de un simple documento.

La entrada estrella es **«Red WiMAX: la promesa inalámbrica que llegó a Bolivia»**: la historia completa del
estándar IEEE 802.16, con línea de tiempo, laboratorio de señal que calcula la zona de Fresnel, mapa mundial
de despliegues, un mapa esquemático de Bolivia con Entel / VIVA / COTAS, quiz autoevaluable, glosario buscable
y fuentes citadas.

```bash
npm install        # instala dependencias
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run verificar  # tests unitarios + compilación de producción
npm run e2e        # pruebas de extremo a extremo (Playwright + Edge)
npm run preview    # sirve la versión compilada (http://localhost:4173)
```

## Stack (todo real y en uso)

| Tecnología | Para qué se usa en el blog |
| --- | --- |
| **React 19 + TypeScript** | Base de la interfaz, con tipado estricto (`strict`, `noUnusedLocals`). |
| **Vite 6** | Servidor de desarrollo, compilación y división de bundles (`manualChunks`). |
| **Tailwind CSS 4** | Utilidades + tokens propios (`--color-acento`, `--color-fondo`…) y capa `@layer components`. |
| **Three.js + React Three Fiber** | Escena 3D del hero: torre de telecomunicaciones, anillos de propagación y partículas. |
| **GLSL (a mano)** | `shaderMaterial` propio para el terreno con ondas concéntricas y rejilla técnica. |
| **WebGPU + WGSL** | Visualizador de ondas calculado en la GPU (`navigator.gpu`), con respaldo Canvas 2D. |
| **WebAssembly (a mano)** | Módulo de 175 bytes con `fresnel`, `atenuacion` y `simular`; se compara contra JavaScript. |
| **GSAP + ScrollTrigger** | Revelado de secciones, línea de tiempo, cursor propio y flujo animado del diagrama de red. |
| **Zustand** | Estado del blog: sección activa, sonido, cursor, puntaje del quiz y diagnóstico del navegador. |
| **Zod** | Validación de *todo* el contenido y del quiz (los datos no compilan si están mal escritos). |
| **React Hook Form** | Formulario del quiz (radios registrados, corrección y reinicio). |
| **TanStack Query, Motion, Lottie** | Instaladas como parte del stack del autor (animaciones y datos). |
| **Web Audio API** | Sonido reactivo opcional que responde al scroll (se activa con 🔇). |
| **CSS Houdini** | Worklet `paint(ondas)` que pinta ondas de radio detrás del hero. |
| **PWA (vite-plugin-pwa)** | Manifest, service worker, instalación como app y funcionamiento sin conexión. |
| **Vitest + Playwright** | 13 pruebas unitarias + 16 pruebas E2E (escritorio y móvil). |
| **web-vitals** | LCP, INP, CLS, FCP y TTFB medidos en tu navegador y mostrados en vivo. |

## Características interactivas de la entrada WiMAX

- **Laboratorio de Fresnel**: sliders de distancia y frecuencia; muestra el radio, el despeje del 60 %, el
  elipsoide y un obstáculo, y compara el cálculo en JavaScript contra **WebAssembly** (`≈1.9×` más rápido).
- **Línea de tiempo**: 11 hitos navegables (1999 → hoy) con tonos según auge, caída o Bolivia.
- **Diagrama de la red**: seis pasos explicados sobre un SVG con el flujo de datos animado.
- **Cobertura mundial**: Corea del Sur, EE.UU., Rusia, Japón, Chile, Australia y Bolivia.
- **Bolivia**: esquema del territorio con La Paz/El Alto, Cochabamba y Santa Cruz, hitos locales y tabla de
  empresas, proveedores y regulador (ATT).
- **Quiz de 8 preguntas** con corrección, explicación por respuesta y mejor puntaje guardado.
- **Glosario buscable** de 15 términos (802.16, OFDMA, zona de Fresnel, backhaul, AeroMACS…).
- **Fuentes**: 18 referencias agrupadas, con nota de lo que queda por investigar.

## Estructura

```
src/
  App.tsx                    enrutado y composición de páginas
  enrutado.tsx               router propio sobre hash + View Transitions + enlaces a secciones
  estado.ts                  tienda Zustand (persistida en localStorage)
  datos/
    esquemas.ts              esquemas Zod de todo el contenido
    wimax.ts                 la investigación completa + índice del blog + «Sobre mí»
    contenido.test.ts        13 pruebas unitarias
  componentes/
    interfaz.tsx             barra de navegación, pie, cursor, progreso, sonido, diagnóstico
    lienzo.tsx               escena 3D (R3F) con shaders GLSL
    ui.tsx                   sección, fichas, comparativa, panel de diagnóstico
    wimax.tsx                línea de tiempo + laboratorio de Fresnel (WASM)
    wimax-diagramas.tsx      diagrama de red + cobertura + WebGPU/WGSL
    wimax-cierre.tsx         Bolivia, personajes, aprendizajes, quiz, glosario, fuentes
  paginas/                   Inicio, EntradaWimax, Simples (Sobre mí, 404, informe)
  lib/                       wasm.ts, plataforma.ts (WebGPU, vitals, sonido, Houdini)
  estilos/global.css         tokens, glassmorphism, view transitions, cursor propio
public/
  favicon.svg · icono-192.png · icono-512.png
  paint/ondas.js             worklet de Houdini
  informe/red-wimax.md       informe original descargable (16 KB)
scripts/
  construir_wasm.mjs         genera el módulo WebAssembly escrito a mano
  generar_iconos.mjs         genera los PNG de la PWA sin dependencias (zlib + PNG a mano)
e2e/blog.spec.ts             pruebas de extremo a extremo
```
