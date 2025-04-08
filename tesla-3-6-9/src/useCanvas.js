import { useRef, useEffect } from 'react'

const useCanvas = draw => {

  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId

    const calculateScaleX = () => (!canvas.current ? 0 : canvas.current.clientWidth / scaleWidth);
    const calculateScaleY = () => (!canvas.current ? 0 : canvas.current.clientHeight / scaleHeight);

    const resized = () => {
      canvas.current.width = canvas.current.clientWidth;
      canvas.current.height = canvas.current.clientHeight;
      setScale({ x: calculateScaleX(), y: calculateScaleY() });
    };

    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return canvasRef
}

export default useCanvas
