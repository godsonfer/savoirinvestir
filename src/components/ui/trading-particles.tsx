"use client"
import { useEffect, useRef } from 'react'

// Définition des symboles de trading
const symbols = ['📈', '📉', '💹', '💰', '💵', '📊', '🏦', '💎', '📱', '💼', '🪙', '📋']

interface Particle {
  x: number
  y: number
  symbol: string
  speed: number
  size: number
  opacity: number
  rotation: number
  rotationSpeed: number
}

export const TradingParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuration
    const config = {
      particleCount: 30,
      minSpeed: 0.2,
      maxSpeed: 0.8,
      minSize: 14,
      maxSize: 24,
      fadeInDuration: 60,
    }

    // Ajuster la taille du canvas
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Créer les particules
    const particles: Particle[] = Array.from({ length: config.particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      speed: config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed),
      size: config.minSize + Math.random() * (config.maxSize - config.minSize),
      opacity: 0,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    }))

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Mise à jour de la position
        particle.y -= particle.speed
        particle.rotation += particle.rotationSpeed

        // Réinitialiser la position si la particule sort de l'écran
        if (particle.y < -50) {
          particle.y = canvas.height + 50
          particle.x = Math.random() * canvas.width
          particle.symbol = symbols[Math.floor(Math.random() * symbols.length)]
        }

        // Fade in au début
        if (frame < config.fadeInDuration) {
          particle.opacity = Math.min(frame / config.fadeInDuration, 0.7)
        }

        // Dessiner la particule
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)
        ctx.font = `${particle.size}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fillText(particle.symbol, 0, 0)
        ctx.restore()
      })

      frame++
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
} 
