import React, { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'

export default function App() {
  const [zoom, setZoom] = useState(1)
  const [activeTool, setActiveTool] = useState(null)
  const minZoom = 0.5
  const maxZoom = 3
  const zoomStep = 0.05
  const viewportRef = useRef(null)
  const canvasRef = useRef(null)
  const panState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    startScrollTop: 0,
  })
  const strokeState = useRef({ drawing: false })

  useEffect(() => {
    const el = viewportRef.current
    if (el) el.style.setProperty('--content-zoom', String(zoom))
  }, [zoom])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  function handleWheel(e) {
    
    e.preventDefault()
    const delta = -Math.sign(e.deltaY) // wheel up -> positive
    setZoom(z => {
      const next = Math.min(maxZoom, Math.max(minZoom, +(z + delta * zoomStep).toFixed(3)))
      return next
    })
  }

  function beginPan(clientX, clientY) {
    const el = viewportRef.current
    if (!el) return
    panState.current.active = true
    panState.current.startX = clientX
    panState.current.startY = clientY
    panState.current.startScrollLeft = el.scrollLeft
    panState.current.startScrollTop = el.scrollTop
    el.classList.add('panning')
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', endPan)
    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', endPan)
  }

  function onViewportMouseDown(e) {
    // Pen uses left button; pan uses right button
    if (activeTool === 'pen' && e.button === 0) return
    if (e.button === 2) {
      e.preventDefault()
      beginPan(e.clientX, e.clientY)
    }
  }

  function onPointerDown(e) {
    // Touch starts panning
    if (e.pointerType === 'touch') {
      e.preventDefault()
      beginPan(e.clientX, e.clientY)
    }
  }

  function onMouseMove(e) {
    if (!panState.current.active) return
    const el = viewportRef.current
    if (!el) return
    const dx = e.clientX - panState.current.startX
    const dy = e.clientY - panState.current.startY
    el.scrollLeft = panState.current.startScrollLeft - dx
    el.scrollTop = panState.current.startScrollTop - dy
  }

  function onPointerMove(e) {
    if (e.pointerType !== 'touch') return
    if (!panState.current.active) return
    e.preventDefault()
    const el = viewportRef.current
    if (!el) return
    const dx = e.clientX - panState.current.startX
    const dy = e.clientY - panState.current.startY
    el.scrollLeft = panState.current.startScrollLeft - dx
    el.scrollTop = panState.current.startScrollTop - dy
  }

  function endPan() {
    if (!panState.current.active) return
    const el = viewportRef.current
    panState.current.active = false
    if (el) el.classList.remove('panning')
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', endPan)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', endPan)
  }

  function preventContextMenu(e) {
    // Disable default context menu so right-click can be used for panning
    e.preventDefault()
  }

  function resizeCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // keep drawing coordinates in CSS pixels
  }

  function getCanvasPosition(e) {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  function beginStroke(e) {
    if (activeTool !== 'pen' || e.button !== 0) return
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const pos = getCanvasPosition(e)
    if (!pos) return
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#111827'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    strokeState.current.drawing = true
    strokeState.current.lastX = pos.x
    strokeState.current.lastY = pos.y
  }

  function drawStroke(e) {
    if (!strokeState.current.drawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const pos = getCanvasPosition(e)
    if (!pos) return
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(strokeState.current.lastX, strokeState.current.lastY)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    strokeState.current.lastX = pos.x
    strokeState.current.lastY = pos.y
  }

  function endStroke() {
    if (!strokeState.current.drawing) return
    strokeState.current.drawing = false
  }

  function handleToolSelect(toolId) {
    setActiveTool(prev => (prev === toolId ? null : toolId))
  }

  const viewportClass = ['zoom-viewport', activeTool === 'pen' ? 'pen-active' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className="app-root">
      <Sidebar activeTool={activeTool} onSelect={handleToolSelect} />

      <main className="app-main">
        <div
          ref={viewportRef}
          className={viewportClass}
          onWheel={handleWheel}
          onMouseDown={onViewportMouseDown}
          onPointerDown={onPointerDown}
          onContextMenu={preventContextMenu}
          aria-label="Editor canvas viewport"
        >
          <div className="zoom-wrap">
            <canvas
              ref={canvasRef}
              className="draw-layer"
              onMouseDown={beginStroke}
              onMouseMove={drawStroke}
              onMouseUp={endStroke}
              onMouseLeave={endStroke}
            />
            <div className="canvas-label">Web Image Editor</div>
          </div>
        </div>
      </main>
    </div>
  )
}
