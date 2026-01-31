import React, { useState } from 'react'
import { useDocument, PAGE_SIZES } from '../../context/DocumentContext'

function TemplateSelectionModal() {
  const { showTemplateModal, initializeDocument, PAGE_SIZES } = useDocument()
  const [selectedSize, setSelectedSize] = useState('a4')
  const [isLandscape, setIsLandscape] = useState(false)

  if (!showTemplateModal) return null

  const handleCreate = () => {
    initializeDocument(selectedSize, isLandscape ? 'landscape' : 'portrait')
  }

  // Calculate aspect ratio for visual preview
  const getPreviewStyle = (size) => {
    const sizeData = PAGE_SIZES[size]
    const aspectRatio = isLandscape 
      ? sizeData.height / sizeData.width 
      : sizeData.width / sizeData.height
    
    // Base height of 80px, width adjusted by aspect ratio
    const height = 80
    const width = height * aspectRatio
    
    return {
      width: `${width}px`,
      height: `${height}px`
    }
  }

  const sizeOrder = ['a4', 'letter', 'legal', 'a5', 'flyer', 'business']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">Create New Document</h1>
          <p className="text-white/70 text-sm">Choose a page size to get started</p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {sizeOrder.map((sizeKey) => {
            const size = PAGE_SIZES[sizeKey]
            const isSelected = selectedSize === sizeKey
            
            return (
              <button
                key={sizeKey}
                onClick={() => setSelectedSize(sizeKey)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200
                  flex flex-col items-center gap-3
                  ${isSelected 
                    ? 'border-[#00d2ff] bg-white/20' 
                    : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
                  }
                `}
              >
                {/* Visual Preview */}
                <div 
                  className={`
                    rounded border-2 transition-colors
                    ${isSelected ? 'border-[#00d2ff] bg-white/30' : 'border-white/40 bg-white/10'}
                  `}
                  style={getPreviewStyle(sizeKey)}
                />
                
                {/* Label */}
                <div className="text-center">
                  <div className="text-white font-semibold text-sm">{size.name}</div>
                  <div className="text-white/50 text-xs mt-1">
                    {isLandscape 
                      ? `${size.height} x ${size.width} mm`
                      : `${size.width} x ${size.height} mm`
                    }
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#00d2ff] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Orientation Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`
              relative w-14 h-7 rounded-full transition-colors duration-200
              ${isLandscape ? 'bg-[#00d2ff]' : 'bg-white/20'}
            `}>
              <input
                type="checkbox"
                checked={isLandscape}
                onChange={(e) => setIsLandscape(e.target.checked)}
                className="sr-only"
              />
              <div className={`
                absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-200
                ${isLandscape ? 'translate-x-8' : 'translate-x-1'}
              `} />
            </div>
            <span className="text-white font-medium group-hover:text-white/90">
              Landscape Mode
            </span>
          </label>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          className="w-full py-4 bg-linear-to-r from-[#11998e] to-[#38ef7d] rounded-xl text-white font-bold text-lg hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(17,153,142,0.6)] transition-all duration-300"
        >
          Create Document
        </button>
      </div>
    </div>
  )
}

export default TemplateSelectionModal