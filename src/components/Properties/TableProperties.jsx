import React, { useState } from 'react'
import { useFabric } from '../../context/FabricContext'

function TableProperties() {
  const { selectedObject } = useFabric()
  const [localValues, setLocalValues] = useState({})

  if (!selectedObject) return null

  const handleBlur = (prop, value) => {
    setLocalValues(prev => ({ ...prev, [prop]: undefined }))
    updateTableProperty(prop, value)
  }

  const updateTableProperty = (prop, value) => {
    if (selectedObject.type === 'table' && selectedObject.getObjects) {
      if (['scaleX', 'scaleY', 'angle', 'left', 'top'].includes(prop)) {
        selectedObject.set(prop, value)
        selectedObject.setCoords()
      } else {
        const cells = selectedObject.getObjects()
        cells.forEach(cell => {
          if (prop === 'fill') {
            cell.set('fill', value)
          } else if (prop === 'stroke') {
            cell.set('stroke', value)
          } else if (prop === 'strokeWidth') {
            cell.set('strokeWidth', value)
          }
        })
        selectedObject.setCoords()
      }
      selectedObject.canvas?.renderAll()
    }
  }

  const getFirstCell = () => {
    if (selectedObject.type === 'table' && selectedObject.getObjects) {
      const cells = selectedObject.getObjects()
      return cells[0]
    }
    return null
  }

  const firstCell = getFirstCell()
  const tableRows = selectedObject.rows || 3
  const tableCols = selectedObject.cols || 3

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Rows</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/50 text-[13px] cursor-not-allowed"
            value={tableRows}
            disabled
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Columns</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/50 text-[13px] cursor-not-allowed"
            value={tableCols}
            disabled
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Fill Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="w-10 h-9 rounded-lg border border-white/20 cursor-pointer"
              value={firstCell?.fill || '#ffffff'}
              onChange={(e) => updateTableProperty('fill', e.target.value)}
            />
            <span className="text-white/60 text-[12px]">{firstCell?.fill || '#ffffff'}</span>
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Stroke Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="w-10 h-9 rounded-lg border border-white/20 cursor-pointer"
              value={firstCell?.stroke || '#000000'}
              onChange={(e) => updateTableProperty('stroke', e.target.value)}
            />
            <span className="text-white/60 text-[12px]">{firstCell?.stroke || '#000000'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Stroke Width</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={firstCell?.strokeWidth || 1}
            onBlur={(e) => handleBlur('strokeWidth', parseInt(e.target.value))}
            min="0"
            max="10"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Rotation</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={Math.round(selectedObject.angle || 0)}
            onBlur={(e) => handleBlur('angle', parseInt(e.target.value))}
            min="0"
            max="360"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Position X</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={Math.round(selectedObject.left || 0)}
            onBlur={(e) => handleBlur('left', parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Position Y</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={Math.round(selectedObject.top || 0)}
            onBlur={(e) => handleBlur('top', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Scale X (%)</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={Math.round((selectedObject.scaleX || 1) * 100)}
            onBlur={(e) => handleBlur('scaleX', parseInt(e.target.value) / 100)}
            min="10"
            max="200"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Scale Y (%)</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={Math.round((selectedObject.scaleY || 1) * 100)}
            onBlur={(e) => handleBlur('scaleY', parseInt(e.target.value) / 100)}
            min="10"
            max="200"
          />
        </div>
      </div>
    </div>
  )
}

export default TableProperties