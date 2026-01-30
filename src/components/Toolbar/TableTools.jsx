import React, { useState } from 'react'
import { useFabric } from '../../context/FabricContext'
import { fabric } from 'fabric'

function TableTools() {
  const { canvas } = useFabric()
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)

  const addTable = () => {
    if (!canvas) return

    const cellWidth = 100
    const cellHeight = 30
    const startX = 100
    const startY = 100

    const cells = []

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const rect = new fabric.Rect({
          left: j * cellWidth,
          top: i * cellHeight,
          width: cellWidth,
          height: cellHeight,
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 1,
          selectable: false
        })
        cells.push(rect)
      }
    }

    const tableGroup = new fabric.Group(cells, {
      left: startX,
      top: startY,
      type: 'table',
      rows: rows,
      cols: cols,
      cellWidth: cellWidth,
      cellHeight: cellHeight
    })

    canvas.add(tableGroup)
    canvas.setActiveObject(tableGroup)
    canvas.renderAll()
  }

  return (
    <>
      <div className="grid grid-cols-6 md:grid-cols-2 gap-2 md:gap-3 overflow-visible">
        <button 
          className="flex flex-col items-center justify-center p-2 md:p-4 bg-white/20 border border-white/30 rounded-lg text-xs md:text-[12px] font-semibold text-white transition-all duration-300 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-white/30 hover:border-white/50 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
          onClick={addTable}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-8 md:h-8 mb-1 md:mb-2 flex-shrink-0">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
          <span className="flex-shrink-0">Table</span>
        </button>
      </div>
      <div className="mt-2 md:mt-3 px-1">
        <label className="block text-[10px] md:text-[12px] font-semibold text-white/90 uppercase tracking-wider mb-2">Size</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="1"
            max="10"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            className="w-[50px] md:w-[55px] px-2 py-2 bg-white/20 border border-white/30 rounded-md text-white text-xs md:text-[13px] font-medium focus:outline-none focus:border-[#6c68fb] focus:shadow-[0_0_0_3px_rgba(108,104,251,0.3)]"
          />
          <span className="text-white/80 text-sm font-medium">×</span>
          <input
            type="number"
            min="1"
            max="10"
            value={cols}
            onChange={(e) => setCols(parseInt(e.target.value) || 1)}
            className="w-[50px] md:w-[55px] px-2 py-2 bg-white/20 border border-white/30 rounded-md text-white text-xs md:text-[13px] font-medium focus:outline-none focus:border-[#6c68fb] focus:shadow-[0_0_0_3px_rgba(108,104,251,0.3)]"
          />
        </div>
      </div>
    </>
  )
}

export default TableTools