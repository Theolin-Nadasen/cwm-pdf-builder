import React, { useState, useEffect } from 'react'
import { useFabric } from '../../context/FabricContext'
import TextProperties from '../Properties/TextProperties'
import ShapeProperties from '../Properties/ShapeProperties'
import ImageProperties from '../Properties/ImageProperties'
import TableProperties from '../Properties/TableProperties'
import MultiSelectionProperties from '../Properties/MultiSelectionProperties'

function PropertiesPanel() {
  const { selectedObject, selectedObjects, deleteSelected, duplicateSelected, bringToFront, sendToBack, ungroupSelected, updateKey } = useFabric()
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handlePanelToggle = () => {
    setIsPanelOpen(!isPanelOpen)
  }

  // Only show panel when something is selected AND panel is open (on mobile)
  const shouldShowPanel = selectedObjects && selectedObjects.length > 0 && (!isMobile || isPanelOpen)
  
  // On mobile with no selection, show a floating button to indicate properties are available
  const showMobileButton = isMobile && selectedObjects && selectedObjects.length > 0 && !isPanelOpen

  if (!shouldShowPanel) {
    return (
      <>
        {/* Mobile floating button to open properties when something is selected */}
        {showMobileButton && (
          <button 
            className="fixed bottom-20 right-4 z-[1001] w-12 h-12 bg-[#6c68fb] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#5c58eb] transition-all"
            onClick={handlePanelToggle}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        )}
        {/* Desktop empty state - invisible */}
        <div className="hidden md:flex fixed top-[70px] right-0 w-full max-w-[280px] min-w-[280px] bottom-0 z-[1000] border-l border-white/20 bg-[#16162a] flex-col overflow-hidden opacity-0 pointer-events-none" key={updateKey}>
          <div className="flex-shrink-0 flex justify-between items-center px-4 py-4 border-b border-white/10">
            <h2 className="text-[14px] font-semibold text-white">Properties</h2>
          </div>
        </div>
      </>
    )
  }

  const isMultipleSelected = selectedObjects.length > 1

  if (isMultipleSelected) {
    return (
      <div className={`fixed z-[1000] border-l border-white/20 bg-[#16162a] flex flex-col overflow-hidden transition-transform duration-300 ${
        isMobile 
          ? 'top-[120px] left-4 right-4 bottom-20 max-w-none rounded-xl shadow-2xl' 
          : 'top-[70px] right-0 w-full max-w-[280px] min-w-[280px] bottom-0'
      }`} key={updateKey}>
        <div className="flex-shrink-0 flex justify-between items-center px-4 py-4 border-b border-white/10">
          <h2 className="text-[14px] font-semibold text-white">Properties</h2>
          <button className="w-8 h-8 flex items-center justify-center text-white bg-white/10 rounded hover:bg-white/20 transition-all" onClick={handlePanelToggle}>
            {isMobile ? '×' : (isPanelOpen ? '−' : '+')}
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          <MultiSelectionProperties key={updateKey} />
          <div className="px-4 py-4 border-t border-white/10">
            <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-3">Actions</label>
            <div className="grid grid-cols-2 gap-2">
              <button className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[12px] font-medium hover:bg-white/20 transition-all" onClick={duplicateSelected}>Duplicate</button>
              <button className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[12px] font-medium hover:bg-white/20 transition-all" onClick={bringToFront}>To Front</button>
              <button className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[12px] font-medium hover:bg-white/20 transition-all" onClick={sendToBack}>To Back</button>
              <button className="px-3 py-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-[12px] font-medium hover:bg-red-500/30 transition-all" onClick={deleteSelected}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const type = selectedObject.type

  return (
    <div className={`fixed z-[1000] border-l border-white/20 bg-[#16162a] flex flex-col overflow-hidden transition-transform duration-300 ${
      isMobile 
        ? 'top-[120px] left-4 right-4 bottom-20 max-w-none rounded-xl shadow-2xl' 
        : 'top-[70px] right-0 w-full max-w-[280px] min-w-[280px] bottom-0'
    }`} key={updateKey}>
      <div className="flex-shrink-0 flex justify-between items-center px-4 py-4 border-b border-white/10">
        <h2 className="text-[14px] font-semibold text-white">Properties</h2>
        <button className="w-8 h-8 flex items-center justify-center text-white bg-white/10 rounded hover:bg-white/20 transition-all" onClick={handlePanelToggle}>
          {isMobile ? '×' : (isPanelOpen ? '−' : '+')}
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        {type === 'i-text' && <TextProperties key={updateKey} />}
        {(type === 'rect' || type === 'circle' || type === 'line' || type === 'triangle' || type === 'path') && <ShapeProperties key={updateKey} />}
        {type === 'image' && <ImageProperties key={updateKey} />}
        {type === 'table' && <TableProperties key={updateKey} />}

        <div className="px-4 py-4 border-t border-white/10">
          <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider mb-3">Actions</label>
          <div className="grid grid-cols-2 gap-2">
            {type === 'table' && (
              <button className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[12px] font-medium hover:bg-white/20 transition-all" onClick={ungroupSelected}>Ungroup</button>
            )}
            <button className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[12px] font-medium hover:bg-white/20 transition-all" onClick={duplicateSelected}>Duplicate</button>
            <button className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[12px] font-medium hover:bg-white/20 transition-all" onClick={bringToFront}>To Front</button>
            <button className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-[12px] font-medium hover:bg-white/20 transition-all" onClick={sendToBack}>To Back</button>
            <button className="px-3 py-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-[12px] font-medium hover:bg-red-500/30 transition-all" onClick={deleteSelected}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertiesPanel