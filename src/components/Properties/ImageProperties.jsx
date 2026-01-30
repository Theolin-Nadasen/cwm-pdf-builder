import React, { useState } from 'react'
import { useFabric } from '../../context/FabricContext'

function ImageProperties() {
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

  const width = selectedObject.width ? Math.round(selectedObject.width * (selectedObject.scaleX || 1)) : 0
  const height = selectedObject.height ? Math.round(selectedObject.height * (selectedObject.scaleY || 1)) : 0

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Width (px)</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={width}
            onBlur={(e) => {
              const newScaleX = parseInt(e.target.value) / selectedObject.width
              handleBlur('scaleX', newScaleX)
            }}
            min="1"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Height (px)</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={height}
            onBlur={(e) => {
              const newScaleY = parseInt(e.target.value) / selectedObject.height
              handleBlur('scaleY', newScaleY)
            }}
            min="1"
          />
        </div>
      </div>

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

export default ImageProperties