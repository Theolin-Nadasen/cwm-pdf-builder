import React, { useState } from 'react'
import { useFabric } from '../../context/FabricContext'

function MultiSelectionProperties() {
  const { canvas } = useFabric()
  const [localValues, setLocalValues] = useState({})

  if (!canvas) return null

  const activeObject = canvas.getActiveObject()
  if (!activeObject || !activeObject.getObjects) return null

  const selectedObjects = activeObject.getObjects() || []
  
  if (selectedObjects.length < 2) return null

  const allText = selectedObjects.every(obj => obj.type === 'i-text')
  const allShapes = selectedObjects.every(obj => ['rect', 'circle', 'line', 'triangle'].includes(obj.type))
  const allImages = selectedObjects.every(obj => obj.type === 'image')
  const allSameType = allText || allShapes || allImages

  const getCommonValue = (prop, defaultValue) => {
    try {
      const values = selectedObjects.map(obj => obj[prop])
      if (values.length > 0 && values.every(v => v === values[0])) {
        return values[0]
      }
      return defaultValue
    } catch (e) {
      return defaultValue
    }
  }

  const handleBlur = (prop, value) => {
    setLocalValues(prev => ({ ...prev, [prop]: undefined }))
    
    selectedObjects.forEach(obj => {
      try {
        obj.set(prop, value)
      } catch (e) {
        console.error('Error setting property:', e)
      }
    })
    
    activeObject.setCoords()
    canvas?.renderAll()
  }

  const handleCenterH = () => {
    try {
      const bounds = activeObject.getBoundingRect()
      const centerX = bounds.left + bounds.width / 2
      const canvasWidth = canvas.width
      const centerPos = canvasWidth / 2
      
      const offset = centerPos - centerX
      
      selectedObjects.forEach(obj => {
        obj.set('left', obj.left + offset)
      })
      
      activeObject.setCoords()
      canvas.renderAll()
    } catch (e) {
      console.error('Error centering horizontally:', e)
    }
  }

  const handleCenterV = () => {
    try {
      const bounds = activeObject.getBoundingRect()
      const centerY = bounds.top + bounds.height / 2
      const canvasHeight = canvas.height
      const centerPos = canvasHeight / 2
      
      const offset = centerPos - centerY
      
      selectedObjects.forEach(obj => {
        obj.set('top', obj.top + offset)
      })
      
      activeObject.setCoords()
      canvas.renderAll()
    } catch (e) {
      console.error('Error centering vertically:', e)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
        <span className="text-white/80 text-[13px] font-medium">{selectedObjects.length} objects selected</span>
      </div>

      {allSameType && (
        <>
          {allText && (
            <div>
              <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Font Size</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
                defaultValue={getCommonValue('fontSize', 20)}
                onBlur={(e) => handleBlur('fontSize', parseInt(e.target.value))}
                min="8"
                max="200"
              />
            </div>
          )}

          {(allShapes || allImages) && (
            <div>
              <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Opacity</label>
              <input
                type="range"
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                defaultValue={getCommonValue('opacity', 1)}
                onChange={(e) => handleBlur('opacity', parseFloat(e.target.value))}
                min="0"
                max="1"
                step="0.1"
              />
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Rotation</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={Math.round(getCommonValue('angle', 0) || 0)}
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
            defaultValue={Math.round(getCommonValue('left', 0))}
            onBlur={(e) => handleBlur('left', parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Position Y</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={Math.round(getCommonValue('top', 0))}
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
            defaultValue={Math.round(getCommonValue('scaleX', 1) * 100)}
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
            defaultValue={Math.round(getCommonValue('scaleY', 1) * 100)}
            onBlur={(e) => handleBlur('scaleY', parseInt(e.target.value) / 100)}
            min="10"
            max="200"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Alignment</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[12px] font-medium hover:bg-white/20 transition-all"
            onClick={handleCenterH}
          >
            Center Horizontally
          </button>
          <button
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[12px] font-medium hover:bg-white/20 transition-all"
            onClick={handleCenterV}
          >
            Center Vertically
          </button>
        </div>
      </div>
    </div>
  )
}

export default MultiSelectionProperties