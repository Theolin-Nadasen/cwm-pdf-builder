import React, { useState, useEffect, useRef } from 'react'

function ContextMenu({ isOpen, position, onClose, selectedObject, onSetLink, onRemoveLink, onAddShadow, onRemoveShadow, onDuplicate, onDelete, onBringToFront, onSendToBack }) {
  const menuRef = useRef(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [activeSubmenu, setActiveSubmenu] = useState(null)

  useEffect(() => {
    if (isOpen && selectedObject) {
      setLinkUrl(selectedObject.linkUrl || '')
    }
  }, [isOpen, selectedObject])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose()
        setShowLinkInput(false)
        setActiveSubmenu(null)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleSetLink = () => {
    if (linkUrl.trim()) {
      onSetLink(linkUrl.trim())
    }
    setShowLinkInput(false)
    onClose()
  }

  const handleOpenLink = () => {
    if (selectedObject?.linkUrl) {
      window.open(selectedObject.linkUrl, '_blank')
    }
    onClose()
  }

  const hasLink = selectedObject?.linkUrl
  const hasShadow = selectedObject?.shadow

  if (!isOpen || !selectedObject) return null

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-[#1a1a2e]/95 backdrop-blur-md border border-white/30 rounded-lg shadow-2xl py-2 min-w-[200px]"
      style={{ left: position.x, top: position.y }}
    >
      {/* Link Section */}
      <div className="px-2 pb-2 border-b border-white/10">
        <div className="text-white/40 text-[10px] uppercase tracking-wider px-3 py-1">Link</div>
        
        {showLinkInput ? (
          <div className="px-2 py-1">
            <input
              type="text"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-[12px] focus:outline-none focus:border-[#6c68fb]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSetLink()
                if (e.key === 'Escape') {
                  setShowLinkInput(false)
                  setLinkUrl(selectedObject?.linkUrl || '')
                }
              }}
            />
            <div className="flex gap-1 mt-1">
              <button
                onClick={handleSetLink}
                className="flex-1 px-2 py-1 bg-[#6c68fb] text-white text-[11px] rounded hover:bg-[#5a56d9] transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowLinkInput(false)
                  setLinkUrl(selectedObject?.linkUrl || '')
                }}
                className="flex-1 px-2 py-1 bg-white/10 text-white text-[11px] rounded hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowLinkInput(true)}
              className="w-full text-left px-3 py-1.5 text-white text-[13px] hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              {hasLink ? 'Edit Link' : 'Add Link'}
            </button>
            
            {hasLink && (
              <>
                <button
                  onClick={handleOpenLink}
                  className="w-full text-left px-3 py-1.5 text-white text-[13px] hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Open Link
                </button>
                <button
                  onClick={() => {
                    onRemoveLink()
                    onClose()
                  }}
                  className="w-full text-left px-3 py-1.5 text-red-400 text-[13px] hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Remove Link
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Effects Section */}
      <div className="px-2 py-2 border-b border-white/10">
        <div className="text-white/40 text-[10px] uppercase tracking-wider px-3 py-1">Effects</div>
        
        {hasShadow ? (
          <button
            onClick={() => {
              onRemoveShadow()
              onClose()
            }}
            className="w-full text-left px-3 py-1.5 text-white text-[13px] hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Remove Shadow
          </button>
        ) : (
          <button
            onClick={() => {
              onAddShadow()
              onClose()
            }}
            className="w-full text-left px-3 py-1.5 text-white text-[13px] hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Add Drop Shadow
          </button>
        )}
      </div>

      {/* Actions Section */}
      <div className="px-2 pt-2">
        <div className="text-white/40 text-[10px] uppercase tracking-wider px-3 py-1">Actions</div>
        
        <button
          onClick={() => {
            onDuplicate()
            onClose()
          }}
          className="w-full text-left px-3 py-1.5 text-white text-[13px] hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Duplicate
        </button>
        
        <button
          onClick={() => {
            onBringToFront()
            onClose()
          }}
          className="w-full text-left px-3 py-1.5 text-white text-[13px] hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <polyline points="17 11 12 6 7 11" />
            <polyline points="17 18 12 13 7 18" />
          </svg>
          Bring to Front
        </button>
        
        <button
          onClick={() => {
            onSendToBack()
            onClose()
          }}
          className="w-full text-left px-3 py-1.5 text-white text-[13px] hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
          </svg>
          Send to Back
        </button>
        
        <button
          onClick={() => {
            onDelete()
            onClose()
          }}
          className="w-full text-left px-3 py-1.5 text-red-400 text-[13px] hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  )
}

export default ContextMenu
