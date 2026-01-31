import { useEffect } from 'react'

export function useKeyboardShortcuts({ onDelete, onUndo, onRedo, onDuplicate, onBringToFront, onSendToBack, onShowHelp, onShowContextMenu, onDeselect }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in an input field
      const activeElement = document.activeElement
      const isInput = activeElement.tagName === 'INPUT' ||
                      activeElement.tagName === 'TEXTAREA' ||
                      activeElement.isContentEditable

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault()
          onUndo?.()
        } else if (e.key === 'y') {
          e.preventDefault()
          onRedo?.()
        } else if (e.key === 'd') {
          e.preventDefault()
          onDuplicate?.()
        } else if (e.key === ']') {
          e.preventDefault()
          onBringToFront?.()
        } else if (e.key === '[') {
          e.preventDefault()
          onSendToBack?.()
        } else if (e.key === 'e') {
          e.preventDefault()
          onShowContextMenu?.()
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!isInput) {
          e.preventDefault()
          onDelete?.()
        }
      } else if (e.key === '?' && !isInput) {
        e.preventDefault()
        onShowHelp?.()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onDeselect?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onDelete, onUndo, onRedo, onDuplicate, onBringToFront, onSendToBack, onShowHelp, onShowContextMenu, onDeselect])
}
