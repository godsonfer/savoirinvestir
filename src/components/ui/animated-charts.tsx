"use client"
import { useEffect, useRef } from 'react'

export const AnimatedCharts = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuration
    const config = {
      lineColor: 'rgba(6, 182, 212, 0.4)',
      lineWidth: 3,
      pointRadius: 2,
      pointCount: 150,
      speed: 0.3,
      amplitude: 80,
      frequency: 0.015,
      lines: 4
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

    // Points pour les graphiques
    const points = Array.from({ length: config.pointCount }, (_, i) => ({
      x: (window.innerWidth / (config.pointCount - 1)) * i,
      y: window.innerHeight / 2,
      offset: Math.random() * 1000
    }))

    // Animation
    let animationFrame: number
    let time = 0

    const drawLine = (offset: number, alpha: number) => {
      ctx.beginPath()
      ctx.strokeStyle = config.lineColor.replace('0.4', alpha.toString())
      ctx.lineWidth = config.lineWidth

      points.forEach((point, index) => {
        const y = canvas.height / 2 +
          Math.sin((time + point.offset + offset) * config.frequency) * config.amplitude

        if (index === 0) {
          ctx.moveTo(point.x, y)
        } else {
          const xc = (point.x + points[index - 1].x) / 2
          const yc = (y + points[index - 1].y) / 2
          ctx.quadraticCurveTo(points[index - 1].x, points[index - 1].y, xc, yc)
        }

        // Points lumineux
        ctx.fillStyle = `rgba(6, 182, 212, ${alpha * 0.8})`
        ctx.beginPath()
        ctx.arc(point.x, y, config.pointRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Effet de lueur
      ctx.shadowBlur = 20
      ctx.shadowColor = 'rgba(6, 182, 212, 0.3)'

      // Dessiner plusieurs lignes avec des décalages et opacités différents
      for (let i = 0; i < config.lines; i++) {
        const alpha = 0.4 - (i * 0.1)
        drawLine(i * 100, alpha)
      }

      time += config.speed
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-70"
      style={{ 
        filter: 'blur(0.5px)',
        background: 'linear-gradient(to bottom right, rgb(17, 24, 39), rgb(88, 28, 7))'
      }}
    />
  )
} 
