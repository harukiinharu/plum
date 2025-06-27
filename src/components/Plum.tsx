import { useRef, useEffect, useCallback, useState } from 'react'

const r180 = Math.PI
const r90 = Math.PI / 2
const r15 = Math.PI / 12
const WIDTH = 1
const COLOR = '#6ee36a25'
const MIN_BRANCH = 100
const LEN = 7

function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
  const dx = r * Math.cos(theta)
  const dy = r * Math.sin(theta)
  return [x + dx, y + dy]
}

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const size = useWindowSize()

  // Helper to get device pixel ratio
  const initCanvas = useCallback((canvas: HTMLCanvasElement, width: number, height: number) => {
    const ctx = canvas.getContext('2d')!
    const dpi = window.devicePixelRatio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.width = dpi * width
    canvas.height = dpi * height
    ctx.setTransform(1, 0, 0, 1, 0, 0) // reset transform
    ctx.scale(dpi, dpi)
    return ctx
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = initCanvas(canvas, size.width, size.height)
    let steps: (() => void)[] = []
    let prevSteps: (() => void)[] = []
    let stoppedFlag = false
    const random = Math.random
    let lastTime = performance.now()
    const interval = 1000 / 40 // 50fps

    const step = (x: number, y: number, rad: number, counter: { value: number } = { value: 0 }) => {
      const length = random() * LEN
      counter.value += 1
      const [nx, ny] = polar2cart(x, y, length, rad)
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(nx, ny)
      ctx.stroke()
      const rad1 = rad + random() * r15
      const rad2 = rad - random() * r15
      if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100) return
      const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5
      if (random() < rate) steps.push(() => step(nx, ny, rad1, counter))
      if (random() < rate) steps.push(() => step(nx, ny, rad2, counter))
    }

    const randomMiddle = () => random() * 0.6 + 0.2

    function start() {
      ctx.clearRect(0, 0, size.width, size.height)
      ctx.lineWidth = WIDTH
      ctx.strokeStyle = COLOR
      prevSteps = []
      steps = [
        () => step(randomMiddle() * size.width, -5, r90),
        () => step(randomMiddle() * size.width, size.height + 5, -r90),
        () => step(-5, randomMiddle() * size.height, 0),
        () => step(size.width + 5, randomMiddle() * size.height, r180),
      ]
      if (size.width < 500) steps = steps.slice(0, 2)
      stoppedFlag = false
      animate()
    }

    function animate() {
      if (stoppedFlag) return
      animationRef.current = requestAnimationFrame(animate)
      if (performance.now() - lastTime < interval) return
      lastTime = performance.now()
      prevSteps = steps
      steps = []
      if (!prevSteps.length) {
        stoppedFlag = true
        return
      }
      prevSteps.forEach(i => {
        if (random() < 0.5) steps.push(i)
        else i()
      })
    }

    start()
    return () => {
      stoppedFlag = true
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
    // eslint-disable-next-line
  }, [size.width, size.height, initCanvas])

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 pointer-events-none print:hidden'>
      <canvas ref={canvasRef} width={size.width} height={size.height} />
    </div>
  )
}

export default App
