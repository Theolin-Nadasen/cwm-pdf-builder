import React, { useState } from 'react'
import { useFabric } from '../../context/FabricContext'

function TextProperties() {
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

  const getValue = (prop, defaultValue) => {
    if (localValues[prop] !== undefined) return localValues[prop]
    return selectedObject[prop] ?? defaultValue
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Text Content</label>
        <input
          type="text"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
          defaultValue={selectedObject.text || ''}
          onBlur={(e) => handleBlur('text', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Font Family</label>
        <select
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
          defaultValue={selectedObject.fontFamily || 'Arial'}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
        >
          <option value="Arial" className="bg-[#1a1a2e]">Arial</option>
          <option value="Helvetica" className="bg-[#1a1a2e]">Helvetica</option>
          <option value="Times New Roman" className="bg-[#1a1a2e]">Times New Roman</option>
          <option value="Courier New" className="bg-[#1a1a2e]">Courier New</option>
          <option value="Georgia" className="bg-[#1a1a2e]">Georgia</option>
          <option value="Verdana" className="bg-[#1a1a2e]">Verdana</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Font Size</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
            defaultValue={selectedObject.fontSize || 20}
            onBlur={(e) => handleBlur('fontSize', parseInt(e.target.value))}
            min="8"
            max="200"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="w-10 h-9 rounded-lg border border-white/20 cursor-pointer"
              value={selectedObject.fill || '#000000'}
              onChange={(e) => handleChange('fill', e.target.value)}
            />
            <span className="text-white/60 text-[12px]">{selectedObject.fill || '#000000'}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Alignment</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${selectedObject.textAlign === 'left' ? 'bg-[#6c68fb] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            onClick={() => handleChange('textAlign', 'left')}
          >
            Left
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${selectedObject.textAlign === 'center' ? 'bg-[#6c68fb] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            onClick={() => handleChange('textAlign', 'center')}
          >
            Center
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${selectedObject.textAlign === 'right' ? 'bg-[#6c68fb] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            onClick={() => handleChange('textAlign', 'right')}
          >
            Right
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Style</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            className={`px-3 py-2 rounded-lg text-[12px] font-bold transition-all ${selectedObject.fontWeight === 'bold' ? 'bg-[#6c68fb] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            onClick={() => handleChange('fontWeight', selectedObject.fontWeight === 'bold' ? 'normal' : 'bold')}
          >
            B
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-[12px] italic transition-all ${selectedObject.fontStyle === 'italic' ? 'bg-[#6c68fb] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            onClick={() => handleChange('fontStyle', selectedObject.fontStyle === 'italic' ? 'normal' : 'italic')}
          >
            I
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-[12px] underline transition-all ${selectedObject.underline ? 'bg-[#6c68fb] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            onClick={() => handleChange('underline', !selectedObject.underline)}
          >
            U
          </button>
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

export default TextProperties