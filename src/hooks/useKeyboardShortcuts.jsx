import { useEffect } from 'react'

export function useKeyboardShortcuts({ onDelete, onUndo, onRedo }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault()
          onUndo?.()
        } else if (e.key === 'y') {
          e.preventDefault()
          onRedo?.()
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeElement = document.activeElement
        const isInput = activeElement.tagName === 'INPUT' || 
                        activeElement.tagName === 'TEXTAREA' ||
                        activeElement.isContentEditable
        
        if (!isInput) {
          e.preventDefault()
          onDelete?.()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onDelete, onUndo, onRedo])
}
