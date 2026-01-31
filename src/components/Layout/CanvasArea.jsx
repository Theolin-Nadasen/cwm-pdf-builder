import React, { useEffect, useState } from 'react'
import { useFabric } from '../../context/FabricContext'
import { useDocument } from '../../context/DocumentContext'
import DesignCanvas from '../Canvas/DesignCanvas'
import PageNavigator from '../Pages/PageNavigator'

function CanvasArea({ showHelp, setShowHelp }) {
  const { canvas } = useFabric()
  const { zoom, updateZoom } = useDocument()
  const [canvasElements, setCanvasElements] = useState([])

  useEffect(() => {
    if (canvas) {
      const handleCanvasChange = () => {
        setCanvasElements(canvas.getObjects())
      }
      canvas.on('object:added', handleCanvasChange)
      canvas.on('object:removed', handleCanvasChange)
      canvas.on('object:modified', handleCanvasChange)
      return () => {
        canvas.off('object:added', handleCanvasChange)
        canvas.off('object:removed', handleCanvasChange)
        canvas.off('object:modified', handleCanvasChange)
      }
    }
  }, [canvas])

  const handleZoomIn = () => {
    updateZoom(zoom + 0.1)
  }

  const handleZoomOut = () => {
    updateZoom(zoom - 0.1)
  }

  const handleZoomReset = () => {
    updateZoom(1)
  }

  return (
    <div className="flex flex-col flex-1 bg-black/30 overflow-hidden relative">
      {/* Zoom Controls - Positioned away from canvas on desktop */}
      <div className="absolute top-16 md:top-8 left-1/2 -translate-x-1/2 z-10 flex gap-1 md:gap-2 bg-white/10 backdrop-blur-md p-1.5 md:p-2.5 rounded-xl border border-white/20">
        <button 
          className="flex items-center justify-center px-2.5 md:px-3.5 py-1.5 md:py-2 text-sm text-white/90 bg-white/10 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/15 transition-all"
          onClick={handleZoomOut}
          disabled={zoom <= 0.25}
          title="Zoom Out"
        >
          −
        </button>
        <span className="flex items-center text-xs font-semibold text-white/90 min-w-[40px] md:min-w-[50px] justify-center bg-[#6c68fb]/20 px-2 md:px-3 py-1.5 rounded-lg">
          {Math.round(zoom * 100)}%
        </span>
        <button 
          className="flex items-center justify-center px-2.5 md:px-3.5 py-1.5 md:py-2 text-sm text-white/90 bg-white/10 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/15 transition-all"
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          title="Zoom In"
        >
          +
        </button>
        <button 
          className="hidden md:flex items-center justify-center px-2.5 md:px-3.5 py-1.5 md:py-2 text-xs md:text-sm text-white/90 bg-white/10 rounded-lg hover:bg-white/15 transition-all"
          onClick={handleZoomReset}
          title="Reset Zoom"
        >
          Reset
        </button>
      </div>
      
      {/* Canvas Container */}
      <div className="flex-1 flex justify-center items-start p-2 md:p-[30px] overflow-auto relative min-h-0 pt-32 md:pt-24">
        <DesignCanvas zoom={zoom} showHelp={showHelp} setShowHelp={setShowHelp} />
      </div>
      
      <PageNavigator />
    </div>
  )
}

export default CanvasArea