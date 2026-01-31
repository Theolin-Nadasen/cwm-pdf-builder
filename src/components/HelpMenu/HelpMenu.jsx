import React from 'react'

const shortcuts = [
  { key: 'Esc', description: 'Deselect all items' },
  { key: 'Ctrl + D', description: 'Duplicate selected item' },
  { key: 'Ctrl + Z', description: 'Undo' },
  { key: 'Ctrl + Y', description: 'Redo' },
  { key: 'Delete / Backspace', description: 'Delete selected item' },
  { key: 'Ctrl + Shift + ]', description: 'Bring to front' },
  { key: 'Ctrl + Shift + [', description: 'Send to back' },
  { key: 'Ctrl + E', description: 'Open effects menu' },
  { key: '?', description: 'Show keyboard shortcuts' },
]

function HelpMenu({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-white/10 last:border-0"
            >
              <span className="text-white/80 text-sm">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="text-white/50 text-xs mt-4 text-center">
          Press ? anytime to show this menu
        </p>
      </div>
    </div>
  )
}

export default HelpMenu
