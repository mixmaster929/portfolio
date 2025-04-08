import React, { useRef, useState, useEffect } from 'react'
import Divider from '@mui/material/Divider';

const quickAndDirtyStyle = {
  width: "200px",
  height: "200px",
  background: "#FF9900",
  color: "#FFFFFF",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}

const DraggableWidthComponent = () => {
  const [pressed, setPressed] = useState(false)
  const [position, setPosition] = useState({x: 0, y: 0})
  const ref = useRef()

  // Monitor changes to position state and update DOM
  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`
    }
  }, [position])

  // Update the current position if mouse is down
  const onMouseMove = (event) => {
    event.preventDefault();
    if (pressed) {
      setPosition({
        x: position.x + event.movementX,
        y: position.y
      })
    }
  }

  return (
    <div
      ref={ ref }
      style={ quickAndDirtyStyle }
      onMouseMove={ onMouseMove }
      onMouseLeave = { () => setPressed(false) }
      onMouseDown={ () => setPressed(true) }
      onMouseUp={ () => setPressed(false) }>
      <Divider orientation="vertical" flexItem>
          VERTICAL
      </Divider>

      <p>{ pressed ? "Dragging..." : "Press to drag" }</p>
    </div>
  )
}

export default DraggableWidthComponent
