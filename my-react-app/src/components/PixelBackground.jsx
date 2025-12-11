import { useEffect, useRef } from 'react'

function PixelBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId

    const NUM_PIXELS = 300
    const pixels = []

    const mouse = {
      x: null,
      y: null,
      active: false,
    }

    function resizeCanvas() {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    function createPixels() {
      pixels.length = 0
      const { width, height } = canvas

      for (let i = 0; i < NUM_PIXELS; i++) {
        pixels.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,  // movement speed
          vy: (Math.random() - 0.5) * 0.5,
          size: 2 + Math.random() * 2,
          baseAlpha: 0.15 + Math.random() * 0.25,
          alpha: 0.15 + Math.random() * 0.25,
        })
      }
    }

    function update() {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      for (const p of pixels) {
        // Mouse repulsion + glow
        if (mouse.active && mouse.x != null && mouse.y != null) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const radius = 130

          if (dist < radius) {
            const force = (radius - dist) / radius
            const strength = 0.1

            p.vx += (dx / dist) * force * strength
            p.vy += (dy / dist) * force * strength
            p.alpha = Math.min(1, p.alpha + 0.06)
          }
        }

        // Move
        p.x += p.vx
        p.y += p.vy

        // Soft friction
        p.vx *= 0.985
        p.vy *= 0.985

        // Wrap around edges
        if (p.x < -10) p.x = width + 5
        if (p.x > width + 10) p.x = -5
        if (p.y < -10) p.y = height + 5
        if (p.y > height + 10) p.y = -5

        // Ease alpha back
        p.alpha += (p.baseAlpha - p.alpha) * 0.03

        // Draw glowing pixel
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = '#a5b4ff'
        ctx.shadowColor = 'rgba(165, 180, 255, 0.9)'
        ctx.shadowBlur = 10
        ctx.fillRect(p.x, p.y, p.size, p.size)
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(update)
    }

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }

    function handleMouseLeave() {
      mouse.active = false
    }

    function handleResize() {
      resizeCanvas()
      createPixels()
    }

    // Init
    resizeCanvas()
    createPixels()
    update()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-pixel-canvas" />
}

export default PixelBackground
