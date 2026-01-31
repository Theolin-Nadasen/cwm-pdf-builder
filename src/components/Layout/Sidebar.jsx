import React from 'react'
import TextTools from '../Toolbar/TextTools'
import ShapeTools from '../Toolbar/ShapeTools'
import ImageTools from '../Toolbar/ImageTools'
import TableTools from '../Toolbar/TableTools'
import SvgTools from '../Toolbar/SvgTools'

function Sidebar() {
  return (
    <div className="w-full md:w-[260px] flex-shrink-0 bg-white/10 backdrop-blur-md border-b md:border-b-0 md:border-r border-white/20 flex flex-row md:flex-col md:h-full overflow-x-auto md:overflow-x-hidden md:overflow-y-auto shadow-panel">
      {/* Text Section */}
      <div className="px-3 py-2 md:p-5 border-r md:border-r-0 md:border-b border-white/10 flex-shrink-0 flex flex-col gap-1 md:gap-3 min-w-[80px] md:min-w-0">
        <h3 className="text-[10px] font-bold text-white/80 uppercase tracking-wider whitespace-nowrap md:tracking-wide">
          Text
        </h3>
        <TextTools />
      </div>
      
      {/* Shapes Section */}
      <div className="px-3 py-2 md:p-5 border-r md:border-r-0 md:border-b border-white/10 flex-shrink-0 flex flex-col gap-1 md:gap-3 min-w-[180px] md:min-w-0">
        <h3 className="text-[10px] font-bold text-white/80 uppercase tracking-wider whitespace-nowrap md:tracking-wide">
          Shapes
        </h3>
        <ShapeTools />
      </div>
      
      {/* Images Section */}
      <div className="px-3 py-2 md:p-5 border-r md:border-r-0 md:border-b border-white/10 flex-shrink-0 flex flex-col gap-1 md:gap-3 min-w-[80px] md:min-w-0">
        <h3 className="text-[10px] font-bold text-white/80 uppercase tracking-wider whitespace-nowrap md:tracking-wide">
          Images
        </h3>
        <ImageTools />
      </div>
      
      {/* Tables Section */}
      <div className="px-3 py-2 md:p-5 border-r md:border-r-0 md:border-b border-white/10 flex-shrink-0 flex flex-col gap-1 md:gap-3 min-w-[120px] md:min-w-0">
        <h3 className="text-[10px] font-bold text-white/80 uppercase tracking-wider whitespace-nowrap md:tracking-wide">
          Tables
        </h3>
        <TableTools />
      </div>
      
      {/* SVGs Section */}
      <div className="px-3 py-2 md:p-5 flex-shrink-0 flex flex-col gap-1 md:gap-3 min-w-[140px] md:min-w-0 md:pb-8">
        <h3 className="text-[10px] font-bold text-white/80 uppercase tracking-wider whitespace-nowrap md:tracking-wide">
          SVGs
        </h3>
        <SvgTools />
      </div>
    </div>
  )
}

export default Sidebar