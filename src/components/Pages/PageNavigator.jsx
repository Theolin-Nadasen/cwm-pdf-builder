import React from 'react'
import { useDocument } from '../../context/DocumentContext'

function PageNavigator() {
  const { pages, currentPageIndex, addPage, deletePage, selectPage } = useDocument()

  return (
    <div className="p-3 md:p-5 bg-white/15 backdrop-blur-md border-t border-white/20 flex items-center gap-3 md:gap-4 shadow-[0_-8px_32px_rgba(0,0,0,0.15)]">
      <button 
        className="hidden sm:flex items-center justify-center gap-1 px-3 md:px-4 py-2 md:py-2 bg-white/10 border border-white/25 rounded-lg text-white text-sm md:text-[13px] font-semibold hover:bg-white/20 border-white/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={addPage}
      >
        + Add Page
      </button>
      <button 
        className="sm:hidden flex items-center justify-center gap-1 px-2 md:px-3 py-1.5 md:py-2 bg-white/10 border border-white/25 rounded-lg text-white text-xs md:text-[13px] font-semibold hover:bg-white/20 border-white/40 transition-all duration-300"
        onClick={addPage}
      >
        +
      </button>
      
      <div className="text-xs md:text-[14px] font-semibold text-white/90 bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full">
        {currentPageIndex + 1}/{pages.length}
      </div>

      <div className="flex gap-2 md:gap-2 flex-1 overflow-x-auto py-1">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={`relative min-w-[60px] md:min-w-[70px] h-[84px] md:h-[98px] bg-white/10 border-2 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden
              ${index === currentPageIndex 
                ? 'border-primary-start bg-primary-start/15 shadow-[0_0_20px_rgba(0,210,255,0.4)]' 
                : 'border-transparent hover:border-primary-end hover:-translate-y-0. hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)]'
              }`}
            onClick={() => selectPage(index)}
            title={`Page ${index + 1}`}
          >
            <span className="absolute bottom-1.5 right-1.5 md:bottom-1.5 md:right-1.5 bg-linear-to-r from-[#00d2ff] to-[#3a7bd5] text-white text-[10px] font-bold px-2.5 md:px-3 py-1 md:py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              {index + 1}
            </span>
          </div>
        ))}
      </div>

      {pages.length > 1 && (
        <button
          className="hidden sm:flex items-center justify-center gap-1 px-3 md:px-4 py-2 md:py-2 bg-white/10 border border-red-400 rounded-lg text-red-400 text-sm md:text-[13px] font-semibold hover:bg-red-400/20 hover:border-red-300 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => deletePage(currentPageIndex)}
        >
          Delete Page
        </button>
      )}
    </div>
  )
}

export default PageNavigator
