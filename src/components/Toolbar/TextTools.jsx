import React from 'react'
import { useFabric } from '../../context/FabricContext'
import { fabric } from 'fabric'

function TextTools() {
  const { canvas } = useFabric()

  const addText = () => {
    if (!canvas) return

    const text = new fabric.IText('Double-click to edit', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#000000',
      width: 200
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  return (
    <div className="grid grid-cols-6 md:grid-cols-2 gap-2 md:gap-3 overflow-visible">
      <button 
        className="flex flex-col items-center justify-center p-2 md:p-4 bg-white/20 border border-white/30 rounded-lg text-xs md:text-[12px] font-semibold text-white transition-all duration-300 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-white/30 hover:border-white/50 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
        onClick={addText}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-8 md:h-8 mb-1 md:mb-2 flex-shrink-0">
          <path d="M4 7V4h16v3M9 20h6M12 4v16" />
        </svg>
        <span className="flex-shrink-0">Text</span>
      </button>
    </div>
  )
}

export default TextTools