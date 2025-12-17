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
          <h1>Toolbar</h1>
          <h1>More tools to be added later on.</h1>
        </div>
      </aside>
    </>
  )
}
