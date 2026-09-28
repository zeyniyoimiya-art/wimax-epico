/**
 * CSS Painting API (Houdini) — pinta ondas de radio detrás del hero.
 * Se registra con paint(ondas) y sólo se carga si el navegador la soporta.
 * Si el worklet falla, el CSS de respaldo se ve igual: nunca rompe nada.
 */
class OndasPintadas {
  static get inputProperties() {
    return ['--onda-tono', '--onda-velocidad', '--onda-lineas']
  }

  paint(ctx, geometria, propiedades) {
    const ancho = geometria.width
    const alto = geometria.height
    const tono = String(propiedades.get('--onda-tono')).trim() || '#35e6ff'
    const tono2 = String(propiedades.get('--onda-tono-2')).trim() || '#8b5cff'
    const velocidad = Number.parseFloat(String(propiedades.get('--onda-velocidad'))) || 1
    const lineas = Math.max(2, Math.min(12, Number.parseInt(String(propiedades.get('--onda-lineas')), 10) || 7))

    const tiempo = (typeof performance === 'object' ? performance.now() : Date.now()) / 1000

    ctx.clearRect(0, 0, ancho, alto)

    for (let i = 0; i < lineas; i++) {
      const proporción = i / Math.max(1, lineas - 1)
      ctx.beginPath()
      ctx.globalAlpha = 0.1 + proporción * 0.22
      ctx.strokeStyle = i % 2 === 0 ? tono : tono2
      ctx.lineWidth = 1 + proporción * 2.2
      ctx.lineCap = 'round'

      const amplitud = alto * (0.05 + proporción * 0.11)
      const frecuencia = 0.008 + proporción * 0.01
      const desfase = tiempo * velocidad * (0.6 + proporción * 0.5) + i

      for (let x = 0; x <= ancho; x += 3) {
        // la onda se desvanece en los extremos para que no corte el borde
        const envolvente = Math.sin((x / Math.max(1, ancho)) * Math.PI)
        const y = alto / 2 + Math.sin(x * frecuencia + desfase) * amplitud * envolvente
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // núcleo luminoso
    ctx.globalAlpha = 0.35
    const gradiente = ctx.createRadialGradient(ancho * 0.5, alto * 0.55, 0, ancho * 0.5, alto * 0.55, Math.max(ancho, alto) * 0.6)
    gradiente.addColorStop(0, tono)
    gradiente.addColorStop(1, 'rgba(5,7,13,0)')
    ctx.fillStyle = gradiente
    ctx.fillRect(0, 0, ancho, alto)
    ctx.globalAlpha = 1
  }
}

registerPaint('ondas', OndasPintadas)
