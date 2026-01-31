import React, { useState, useCallback } from 'react'
import { useFabric } from '../../context/FabricContext'
import { loadFont, isFontLoaded } from '../../utils/fontLoader'

// Font list with Google Fonts
const FONT_OPTIONS = [
  // System fonts (always available)
  { value: 'Arial', label: 'Arial', category: 'System' },
  { value: 'Helvetica', label: 'Helvetica', category: 'System' },
  { value: 'Times New Roman', label: 'Times New Roman', category: 'System' },
  { value: 'Courier New', label: 'Courier New', category: 'System' },
  { value: 'Georgia', label: 'Georgia', category: 'System' },
  { value: 'Verdana', label: 'Verdana', category: 'System' },
  
  // Modern Sans (Google Fonts)
  { value: 'Inter', label: 'Inter', category: 'Modern Sans' },
  { value: 'Poppins', label: 'Poppins', category: 'Modern Sans' },
  { value: 'Montserrat', label: 'Montserrat', category: 'Modern Sans' },
  { value: 'Open Sans', label: 'Open Sans', category: 'Modern Sans' },
  { value: 'Raleway', label: 'Raleway', category: 'Modern Sans' },
  
  // Professional (Google Fonts)
  { value: 'Roboto', label: 'Roboto', category: 'Professional' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro', category: 'Professional' },
  { value: 'Lato', label: 'Lato', category: 'Professional' },
  
  // Elegant Serif (Google Fonts)
  { value: 'Playfair Display', label: 'Playfair Display', category: 'Elegant Serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'Elegant Serif' },
  { value: 'Crimson Text', label: 'Crimson Text', category: 'Elegant Serif' },
  
  // Display/Decorative (Google Fonts)
  { value: 'Bebas Neue', label: 'Bebas Neue', category: 'Display' },
  { value: 'Lobster', label: 'Lobster', category: 'Display' },
  { value: 'Pacifico', label: 'Pacifico', category: 'Display' },
  { value: 'Dancing Script', label: 'Dancing Script', category: 'Display' },
  
  // Monospace (Google Fonts)
  { value: 'Fira Code', label: 'Fira Code', category: 'Monospace' },
]

// Group fonts by category
const groupedFonts = FONT_OPTIONS.reduce((acc, font) => {
  if (!acc[font.category]) {
    acc[font.category] = []
  }
  acc[font.category].push(font)
  return acc
}, {})

// Text style presets
const TEXT_PRESETS = [
  { name: 'Clean', style: { fill: '#000000', stroke: null, strokeWidth: 0, shadow: null, textBackgroundColor: null } },
  { name: 'Neon', style: { fill: '#00ffff', stroke: '#ffffff', strokeWidth: 2, shadow: { color: '#00ffff', blur: 20, offsetX: 0, offsetY: 0 }, textBackgroundColor: null } },
  { name: 'Outline', style: { fill: 'transparent', stroke: '#000000', strokeWidth: 2, shadow: null, textBackgroundColor: null } },
  { name: 'Bold Shadow', style: { fill: '#000000', stroke: null, strokeWidth: 0, shadow: { color: 'rgba(0,0,0,0.5)', blur: 15, offsetX: 5, offsetY: 5 }, textBackgroundColor: null } },
  { name: 'Elegant', style: { fill: '#1a1a1a', stroke: null, strokeWidth: 0, shadow: { color: 'rgba(0,0,0,0.1)', blur: 5, offsetX: 2, offsetY: 2 }, textBackgroundColor: null } },
]

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-[#00d2ff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}

function TextProperties() {
  const { selectedObject, updateObject } = useFabric()
  const [localValues, setLocalValues] = useState({})
  const [isLoadingFont, setIsLoadingFont] = useState(false)
  const [loadingFontName, setLoadingFontName] = useState('')
  const [fontError, setFontError] = useState(null)

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

  // Apply preset style
  const applyPreset = (preset) => {
    Object.keys(preset.style).forEach(key => {
      handleChange(key, preset.style[key])
    })
  }

  // Handle font change with loading
  const handleFontChange = useCallback(async (fontFamily) => {
    // Clear any previous errors
    setFontError(null)
    
    // Check if font is already loaded
    if (isFontLoaded(fontFamily)) {
      handleChange('fontFamily', fontFamily)
      return
    }
    
    // System fonts load instantly
    const fontObj = FONT_OPTIONS.find(f => f.value === fontFamily)
    if (fontObj?.category === 'System') {
      handleChange('fontFamily', fontFamily)
      return
    }
    
    // Show loading state for Google Fonts
    setIsLoadingFont(true)
    setLoadingFontName(fontObj?.label || fontFamily)
    
    try {
      // Load the font
      const loaded = await loadFont(fontFamily)
      
      if (loaded) {
        // Font loaded successfully, apply it
        handleChange('fontFamily', fontFamily)
      } else {
        // Font failed to load
        setFontError(`Failed to load ${fontObj?.label || fontFamily}`)
        // Still apply the font - browser will use fallback
        handleChange('fontFamily', fontFamily)
      }
    } catch (error) {
      console.error('Font loading error:', error)
      setFontError(`Error loading ${fontObj?.label || fontFamily}`)
      // Still apply the font - browser will use fallback
      handleChange('fontFamily', fontFamily)
    } finally {
      setIsLoadingFont(false)
      setLoadingFontName('')
    }
  }, [handleChange])

  return (
    <div className="p-4 space-y-4">
      {/* Text Content */}
      <div>
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Text Content</label>
        <input
          type="text"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
          defaultValue={selectedObject.text || ''}
          onBlur={(e) => handleBlur('text', e.target.value)}
        />
      </div>

      {/* Font Family - Grouped with Loading State */}
      <div>
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">
          Font Family
        </label>
        
        {/* Loading Indicator */}
        {isLoadingFont && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-[#00d2ff]/10 border border-[#00d2ff]/30 rounded-lg">
            <LoadingSpinner />
            <span className="text-[#00d2ff] text-[12px]">
              Loading {loadingFontName}...
            </span>
          </div>
        )}
        
        {/* Error Message */}
        {fontError && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-red-400 text-[12px]">
              {fontError}
            </span>
          </div>
        )}
        
        <select
          className={`w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors ${isLoadingFont ? 'opacity-50 cursor-wait' : ''}`}
          value={selectedObject.fontFamily || 'Arial'}
          onChange={(e) => handleFontChange(e.target.value)}
          disabled={isLoadingFont}
        >
          {Object.entries(groupedFonts).map(([category, fonts]) => (
            <optgroup key={category} label={category} className="bg-[#1a1a2e] text-white/90 font-semibold">
              {fonts.map(font => (
                <option key={font.value} value={font.value} className="bg-[#1a1a2e] text-white/80">
                  {font.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        
        <p className="text-white/40 text-[10px] mt-1">
          Google Fonts may take a moment to load on first use
        </p>
      </div>

      {/* Font Size & Color */}
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

      {/* Alignment */}
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

      {/* Style - Bold, Italic, Underline, Strikethrough */}
      <div>
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Style</label>
        <div className="grid grid-cols-4 gap-2">
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
          <button
            className={`px-3 py-2 rounded-lg text-[12px] line-through transition-all ${selectedObject.linethrough ? 'bg-[#6c68fb] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            onClick={() => handleChange('linethrough', !selectedObject.linethrough)}
          >
            S
          </button>
        </div>
      </div>

      {/* Spacing Controls */}
      <div className="border-t border-white/10 pt-4">
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-3">Spacing</label>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Line Height</label>
              <span className="text-white/60 text-[11px]">{selectedObject.lineHeight || 1.16}</span>
            </div>
            <input
              type="range"
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              value={selectedObject.lineHeight || 1.16}
              onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
              min="0.5"
              max="3"
              step="0.1"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Letter Spacing</label>
              <span className="text-white/60 text-[11px]">{selectedObject.charSpacing || 0}</span>
            </div>
            <input
              type="range"
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              value={selectedObject.charSpacing || 0}
              onChange={(e) => handleChange('charSpacing', parseInt(e.target.value))}
              min="-50"
              max="100"
              step="1"
            />
          </div>
        </div>
      </div>

      {/* Text Background Color */}
      <div className="border-t border-white/10 pt-4">
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Background Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            className="w-10 h-9 rounded-lg border border-white/20 cursor-pointer"
            value={selectedObject.textBackgroundColor || 'transparent'}
            onChange={(e) => handleChange('textBackgroundColor', e.target.value === 'transparent' ? null : e.target.value)}
          />
          <button
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-[12px] text-white/70 hover:bg-white/20 transition-all"
            onClick={() => handleChange('textBackgroundColor', null)}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Text Stroke/Border */}
      <div className="border-t border-white/10 pt-4">
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-3">Text Outline</label>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1">Stroke Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-10 h-9 rounded-lg border border-white/20 cursor-pointer"
                  value={selectedObject.stroke || '#000000'}
                  onChange={(e) => handleChange('stroke', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1">Stroke Width</label>
              <input
                type="range"
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                value={selectedObject.strokeWidth || 0}
                onChange={(e) => handleChange('strokeWidth', parseInt(e.target.value))}
                min="0"
                max="10"
                step="1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="border-t border-white/10 pt-4">
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-3">Glow Effect</label>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="glowEnabled"
              checked={selectedObject.glow?.enabled || false}
              onChange={(e) => handleChange('glow', { 
                ...selectedObject.glow, 
                enabled: e.target.checked,
                color: selectedObject.glow?.color || '#00ffff',
                blur: selectedObject.glow?.blur || 20,
                offsetX: selectedObject.glow?.offsetX || 0,
                offsetY: selectedObject.glow?.offsetY || 0
              })}
              className="w-4 h-4 accent-[#6c68fb]"
            />
            <label htmlFor="glowEnabled" className="text-white/80 text-[13px]">Enable Glow</label>
          </div>
          
          {selectedObject.glow?.enabled && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1">Glow Color</label>
                  <input
                    type="color"
                    className="w-full h-9 rounded-lg border border-white/20 cursor-pointer"
                    value={selectedObject.glow?.color || '#00ffff'}
                    onChange={(e) => handleChange('glow', { ...selectedObject.glow, color: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1">Blur</label>
                  <input
                    type="range"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    value={selectedObject.glow?.blur || 20}
                    onChange={(e) => handleChange('glow', { ...selectedObject.glow, blur: parseInt(e.target.value) })}
                    min="5"
                    max="100"
                    step="5"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Regular Shadow Controls */}
      <div className="border-t border-white/10 pt-4">
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-3">Drop Shadow</label>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="shadowEnabled"
              checked={!!selectedObject.shadow}
              onChange={(e) => {
                if (e.target.checked) {
                  handleChange('shadow', {
                    color: 'rgba(0,0,0,0.3)',
                    blur: 10,
                    offsetX: 5,
                    offsetY: 5,
                    affectStroke: false
                  })
                } else {
                  handleChange('shadow', null)
                }
              }}
              className="w-4 h-4 accent-[#6c68fb]"
            />
            <label htmlFor="shadowEnabled" className="text-white/80 text-[13px]">Enable Shadow</label>
          </div>
          
          {selectedObject.shadow && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1">Blur</label>
                  <input
                    type="range"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    value={selectedObject.shadow.blur || 10}
                    onChange={(e) => handleChange('shadow', { ...selectedObject.shadow, blur: parseInt(e.target.value) })}
                    min="0"
                    max="50"
                    step="1"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1">Offset X</label>
                  <input
                    type="range"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    value={selectedObject.shadow.offsetX || 5}
                    onChange={(e) => handleChange('shadow', { ...selectedObject.shadow, offsetX: parseInt(e.target.value) })}
                    min="-50"
                    max="50"
                    step="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1">Offset Y</label>
                <input
                  type="range"
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  value={selectedObject.shadow.offsetY || 5}
                  onChange={(e) => handleChange('shadow', { ...selectedObject.shadow, offsetY: parseInt(e.target.value) })}
                  min="-50"
                  max="50"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1">Shadow Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="w-10 h-9 rounded-lg border border-white/20 cursor-pointer"
                    value={selectedObject.shadow.color || 'rgba(0,0,0,0.3)'}
                    onChange={(e) => handleChange('shadow', { ...selectedObject.shadow, color: e.target.value })}
                  />
                  <span className="text-white/60 text-[12px]">{selectedObject.shadow.color || 'rgba(0,0,0,0.3)'}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Style Presets */}
      <div className="border-t border-white/10 pt-4">
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-3">Quick Styles</label>
        
        <div className="grid grid-cols-5 gap-2">
          {TEXT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-2 py-2 bg-white/10 border border-white/20 rounded-lg text-[11px] text-white/80 hover:bg-white/20 hover:border-white/40 transition-all"
              title={`Apply ${preset.name} style`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Position */}
      <div className="border-t border-white/10 pt-4">
        <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-2">Position</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1">X</label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
              defaultValue={Math.round(selectedObject.left || 0)}
              onBlur={(e) => handleBlur('left', parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1">Y</label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6c68fb] transition-colors"
              defaultValue={Math.round(selectedObject.top || 0)}
              onBlur={(e) => handleBlur('top', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextProperties