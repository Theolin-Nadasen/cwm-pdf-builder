import React from 'react'
import { useFabric } from '../../context/FabricContext'
import { fabric } from 'fabric'

function ShapeTools() {
  const { canvas } = useFabric()

  const addRect = () => {
    if (!canvas) return

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#6c68fb',
      stroke: '#000000',
      strokeWidth: 0
    })

    canvas.add(rect)
    canvas.setActiveObject(rect)
    canvas.renderAll()
  }

  const addCircle = () => {
    if (!canvas) return

    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: '#6c68fb',
      stroke: '#000000',
      strokeWidth: 0
    })

    canvas.add(circle)
    canvas.setActiveObject(circle)
    canvas.renderAll()
  }

  const addLine = () => {
    if (!canvas) return

    const line = new fabric.Line([50, 50, 200, 50], {
      left: 100,
      top: 100,
      stroke: '#000000',
      strokeWidth: 2
    })

    canvas.add(line)
    canvas.setActiveObject(line)
    canvas.renderAll()
  }

  const addTriangle = () => {
    if (!canvas) return

    const triangle = new fabric.Triangle({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#6c68fb',
      stroke: '#000000',
      strokeWidth: 0
    })

    canvas.add(triangle)
    canvas.setActiveObject(triangle)
    canvas.renderAll()
  }

  return (
    <div className="grid grid-cols-6 md:grid-cols-2 gap-2 md:gap-3 overflow-visible">
      <button 
        className="flex flex-col items-center justify-center p-2 md:p-4 bg-white/20 border border-white/30 rounded-lg text-xs md:text-[12px] font-semibold text-white transition-all duration-300 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-white/30 hover:border-white/50 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
        onClick={addRect}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-8 md:h-8 mb-1 md:mb-2 flex-shrink-0">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        </svg>
        <span className="flex-shrink-0">Rect</span>
      </button>
      <button 
        className="flex flex-col items-center justify-center p-2 md:p-4 bg-white/20 border border-white/30 rounded-lg text-xs md:text-[12px] font-semibold text-white transition-all duration-300 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-white/30 hover:border-white/50 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
        onClick={addCircle}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-8 md:h-8 mb-1 md:mb-2 flex-shrink-0">
          <circle cx="12" cy="12" r="10" />
        </svg>
        <span className="flex-shrink-0">Circle</span>
      </button>
      <button 
        className="flex flex-col items-center justify-center p-2 md:p-4 bg-white/20 border border-white/30 rounded-lg text-xs md:text-[12px] font-semibold text-white transition-all duration-300 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-white/30 hover:border-white/50 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
        onClick={addLine}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-8 md:h-8 mb-1 md:mb-2 flex-shrink-0">
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
        <span className="flex-shrink-0">Line</span>
      </button>
      <button 
        className="flex flex-col items-center justify-center p-2 md:p-4 bg-white/20 border border-white/30 rounded-lg text-xs md:text-[12px] font-semibold text-white transition-all duration-300 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-white/30 hover:border-white/50 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
        onClick={addTriangle}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-8 md:h-8 mb-1 md:mb-2 flex-shrink-0">
          <path d="M12 2L2 22h20L12 2z" />
        </svg>
        <span className="flex-shrink-0">Triangle</span>
      </button>
    </div>
  )
}

export default ShapeTools