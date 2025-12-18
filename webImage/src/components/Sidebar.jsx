import React, { useState } from 'react'

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className={`toggle-btn ${open ? 'open' : ''}`}
        aria-expanded={open}
        aria-controls="app-sidebar"
        onClick={() => setOpen(o => !o)}
        title={open ? 'Close toolbar' : 'Open toolbar'}
      >
        {open ? '✕' : '☰'}
      </button>

      <aside
        id="app-sidebar"
        className={`sidebar ${open ? 'open' : ''}`}
        role="complementary"
        aria-hidden={!open}
      >
        <div className="sidebar-inner">
          <h2 className="sr-only">Toolbar</h2>

          <div className="sidebar-buttons">
            <button className="sidebar-btn" aria-label="Select" onClick={() => {}}>
              🔍
            </button>

            <button className="sidebar-btn" aria-label="Crop" onClick={() => {}}>
              ✂️
            </button>

            <button className="sidebar-btn" aria-label="Brush" onClick={() => {}}>
              🖌️
            </button>


            <button className="sidebar-btn" aria-label="Eraser" onClick={() => {}}>
              🧱
            </button>
          </div>

        </div>
      </aside>
    </>
  )
}
