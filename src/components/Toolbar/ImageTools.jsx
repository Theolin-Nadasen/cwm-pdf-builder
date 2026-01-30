import React, { useRef } from 'react'
import { useFabric } from '../../context/FabricContext'
import { fabric } from 'fabric'

function ImageTools() {
  const { canvas } = useFabric()
  const fileInputRef = useRef(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file || !canvas) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imgObj = new Image()
      imgObj.src = event.target.result
      imgObj.onload = () => {
        const fabricImage = new fabric.Image(imgObj, {
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5
        })
        
        canvas.add(fabricImage)
        canvas.setActiveObject(fabricImage)
        canvas.renderAll()
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <>
      <div className="grid grid-cols-6 md:grid-cols-2 gap-2 md:gap-3 overflow-visible">
        <button 
          className="flex flex-col items-center justify-center p-2 md:p-4 bg-white/20 border border-white/30 rounded-lg text-xs md:text-[12px] font-semibold text-white transition-all duration-300 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-white/30 hover:border-white/50 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
          onClick={handleUploadClick}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-8 md:h-8 mb-1 md:mb-2 flex-shrink-0">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10.5 21" />
          </svg>
          <span className="flex-shrink-0">Upload</span>
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </>
  )
}

export default ImageTools