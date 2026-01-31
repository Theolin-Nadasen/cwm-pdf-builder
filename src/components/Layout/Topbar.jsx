import React from 'react'
import { useFabric } from '../../context/FabricContext'
import { useDocument } from '../../context/DocumentContext'
import { generatePDFFromPages } from '../../utils/pdfGenerator'

function Topbar({ onShowHelp }) {
  const { canvas, undo, redo } = useFabric()
  const { pages, canvasDataRef, currentPage } = useDocument()

  const handleExport = async () => {
    try {
      // First save current page data
      if (canvas && currentPage) {
        const currentCanvasData = canvas.toJSON(['linkUrl'])
        // Include page size and orientation in the saved data
        canvasDataRef.current[currentPage.id] = {
          ...currentCanvasData,
          pageSize: currentPage.pageSize,
          orientation: currentPage.orientation,
          dimensions: currentPage.dimensions
        }
      }

      // Collect all pages data
      const allPagesData = pages.map(page => canvasDataRef.current[page.id] || null)

      if (allPagesData.length === 0) {
        alert('No pages to export')
        return
      }

      // Export all pages - PDF generator will read page sizes from the data
      await generatePDFFromPages(allPagesData, {
        filename: 'document.pdf'
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  return (
    <div className="flex justify-between items-center px-4 md:px-7 py-3 bg-white/15 backdrop-blur-md border-b border-white/20 min-h-[60px] shadow-lg">
      {/* Left - CWM Logo */}
      <a 
        href="https://codewithme.co.za" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-lg md:text-[20px] font-bold bg-linear-to-r from-[#00d2ff] to-[#3a7bd5] bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity cursor-pointer z-10"
      >
        CWM
      </a>
      
      {/* Center - PDF Builder (hidden on mobile) */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 text-lg md:text-[18px] font-semibold text-white/90 tracking-wide">
        PDF Builder
      </div>
      
      {/* Right - Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex gap-1 md:gap-2">
          <button 
            className="flex items-center justify-center px-2 md:px-4 py-2 bg-white/10 border border-white/25 rounded-lg text-white text-sm md:text-[13px] font-semibold hover:bg-white/20 border-white/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={undo} 
            title="Undo (Ctrl+Z)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
          </button>
          <button 
            className="flex items-center justify-center px-2 md:px-4 py-2 bg-white/10 border border-white/25 rounded-lg text-white text-sm md:text-[13px] font-semibold hover:bg-white/20 border-white/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={redo} 
            title="Redo (Ctrl+Y)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
            </svg>
          </button>
          <button
            className="hidden md:flex items-center justify-center px-2 md:px-4 py-2 bg-white/10 border border-white/25 rounded-lg text-white text-sm md:text-[13px] font-semibold hover:bg-white/20 border-white/40 transition-all duration-300"
            onClick={onShowHelp}
            title="Keyboard Shortcuts (?)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
        </div>
        <button 
          className="flex items-center gap-2 md:gap-3 px-3 md:px-7 py-2 md:py-3 bg-linear-to-r from-[#11998e] to-[#38ef7d] rounded-xl text-white text-sm md:text-[15px] font-bold hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(17,153,142,0.6)] transition-all duration-300"
          onClick={handleExport}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="hidden sm:inline">Export PDF</span>
          <span className="sm:inline md:hidden">Export</span>
        </button>
      </div>
    </div>
  )
}

export default Topbar