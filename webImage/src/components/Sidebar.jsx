import React, { useState } from 'react'

export default function Sidebar({ activeTool, onSelect }) {
  const [open, setOpen] = useState(false)

  const tools = [
    { id: 'pen', label: 'Pen', icon: '🖊️' },
    { id: 'brush', label: 'Brush', icon: '✒️' },
    { id: 'bucket', label: 'Bucket', icon: '🪣' },
  ]

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
            {tools.map(tool => {
              const isActive = activeTool === tool.id
              return (
                <button
                  key={tool.id}
                  type="button"
                  className={`sidebar-btn ${isActive ? 'active' : ''}`}
                  aria-label={tool.label}
                  aria-pressed={isActive}
                  onClick={() => onSelect(tool.id)}
                >
                  <span aria-hidden="true">{tool.icon}</span>
                </button>
              )
            })}

          </div>

        </div>
      </aside>
    </>
  )
}
