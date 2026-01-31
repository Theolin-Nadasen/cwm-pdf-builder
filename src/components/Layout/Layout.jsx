import React, { useState } from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import CanvasArea from './CanvasArea'
import PropertiesPanel from './PropertiesPanel'
import TemplateSelectionModal from '../TemplateSelectionModal/TemplateSelectionModal'

function Layout() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="flex flex-col w-screen h-screen bg-linear-to-br from-[#0c0c0c] via-[#16213e] to-[#1a1a2e]">
      <TemplateSelectionModal />
      <Topbar onShowHelp={() => setShowHelp(true)} />
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <Sidebar />
        <CanvasArea showHelp={showHelp} setShowHelp={setShowHelp} />
        <PropertiesPanel />
      </div>
    </div>
  )
}

export default Layout
