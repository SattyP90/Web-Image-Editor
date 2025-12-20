import React, { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'

export default function App() {
  const [zoom, setZoom] = useState(1)
  const minZoom = 0.5
  const maxZoom = 3
  const zoomStep = 0.05
  const viewportRef = useRef(null)

  useEffect(() => {
    const el = viewportRef.current
    if (el) el.style.setProperty('--content-zoom', String(zoom))
  }, [zoom])

  function handleWheel(e) {
    
    e.preventDefault()
    const delta = -Math.sign(e.deltaY) // wheel up -> positive
    setZoom(z => {
      const next = Math.min(maxZoom, Math.max(minZoom, +(z + delta * zoomStep).toFixed(3)))
      return next
    })
  }

  return (
    <div className="app-root">
      <Sidebar />

      <main className="app-main">
        <div
          ref={viewportRef}
          className="zoom-viewport"
          onWheel={handleWheel}
          aria-label="Editor canvas viewport"
        >
          <div className="zoom-wrap">
            <h1>Web Image Editor</h1>
          </div>
        </div>
      </main>
    </div>
  )
}
