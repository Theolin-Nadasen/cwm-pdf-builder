import React, { useState } from 'react'
import { useFabric } from '../../context/FabricContext'

function ShapeProperties() {
  const { selectedObject, updateObject } = useFabric()
  const [localValues, setLocalValues] = useState({})

  if (!selectedObject) return null

  const handleChange = (prop, value) => {
    setLocalValues(prev => ({ ...prev, [prop]: value }))
    updateObject({ [prop]: value })
  }

  const handleBlur = (prop, value) => {
    setLocalValues(prev => ({ ...prev, [prop]: undefined }))
    updateObject({ [prop]: value })
  }

  const handleWidthBlur = (value) => {
    if (selectedObject.type === 'circle') {
      handleBlur('radius', parseInt(value) / 2)
    } else {
      handleBlur('width', parseInt(value))
    }
  }

  const handleHeightBlur = (value) => {
    if (selectedObject.type === 'circle') {
      handleBlur('radius', parseInt(value) / 2)
    } else {
      handleBlur('height', parseInt(value))
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Fill Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="w-10 h-9 rounded-lg border border-white/20 cursor-pointer"
              value={selectedObject.fill || '#6c68fb'}
              onChange={(e) => handleChange('fill', e.target.value)}
            />
            <span className="text-white/60 text-[12px]">{selectedObject.fill || '#6c68fb'}</span>
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Stroke Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="w-10 h-9 rounded-lg border border-white/20 cursor-pointer"
              value={selectedObject.stroke || '#000000'}
              onChange={(e) => handleChange('stroke', e.target.value)}
            />
            <span className="text-white/60 text-[12px]">{selectedObject.stroke || '#000000'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Stroke Width</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={selectedObject.strokeWidth || 0}
            onBlur={(e) => handleBlur('strokeWidth', parseInt(e.target.value))}
            min="0"
            max="20"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Opacity</label>
          <input
            type="range"
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer mt-3"
            value={selectedObject.opacity || 1}
            onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
            min="0"
            max="1"
            step="0.1"
          />
        </div>
      </div>

      {selectedObject.type !== 'line' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Width</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
                defaultValue={Math.round(selectedObject.width || selectedObject.radius * 2 || 0)}
                onBlur={(e) => handleWidthBlur(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Height</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
                defaultValue={Math.round(selectedObject.height || selectedObject.radius * 2 || 0)}
                onBlur={(e) => handleHeightBlur(e.target.value)}
                min="1"
              />
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
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
    </div>
  )
}

export default ShapeProperties