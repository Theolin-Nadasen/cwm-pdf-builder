import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useFabric } from '../../context/FabricContext'
import { useDocument } from '../../context/DocumentContext'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import HelpMenu from '../HelpMenu/HelpMenu'
import ContextMenu from '../ContextMenu/ContextMenu'
import { fabric } from 'fabric'

function DesignCanvas({ zoom, showHelp, setShowHelp }) {
  const { canvas, setCanvas, initCanvas, deleteSelected, undo, redo, duplicateSelected, bringToFront, sendToBack, selectedObject, setSelectedObject, setObjectLink, removeObjectLink, addObjectShadow, removeObjectShadow } = useFabric()
  const { currentPageIndex, currentPage, savePageData, getPageData } = useDocument()
  const canvasRef = useRef(null)
  const initializedRef = useRef(false)
  const snapLinesRef = useRef([])
  const previousPageIdRef = useRef(null)
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 })

  // Get dimensions from current page
  const dimensions = currentPage?.dimensions || { width: 595.28, height: 841.89 }

  useKeyboardShortcuts({
    onDelete: deleteSelected,
    onUndo: undo,
    onRedo: redo,
    onDuplicate: duplicateSelected,
    onBringToFront: bringToFront,
    onSendToBack: sendToBack,
    onShowHelp: () => setShowHelp(true),
    onShowContextMenu: () => {
      if (selectedObject && canvas) {
        // Calculate position based on selected object
        const objLeft = selectedObject.left || 0
        const objTop = selectedObject.top || 0
        const objWidth = (selectedObject.width || 0) * (selectedObject.scaleX || 1)
        const objHeight = (selectedObject.height || 0) * (selectedObject.scaleY || 1)
        
        // Convert canvas coordinates to screen coordinates
        const canvasRect = canvasRef.current?.getBoundingClientRect()
        if (canvasRect) {
          const screenX = canvasRect.left + (objLeft + objWidth / 2) * zoom
          const screenY = canvasRect.top + (objTop + objHeight / 2) * zoom
          
          setContextMenu({
            isOpen: true,
            x: screenX,
            y: screenY
          })
        }
      }
    },
    onDeselect: () => {
      if (canvas) {
        canvas.discardActiveObject()
        canvas.renderAll()
        setSelectedObject(null)
      }
    }
  })

  const SNAP_TOLERANCE = 8

  // Calculate effective snap tolerance based on zoom level
  const getEffectiveTolerance = useCallback(() => {
    return SNAP_TOLERANCE / zoom
  }, [zoom])

  const clearSnapLines = useCallback(() => {
    if (!canvas) return
    snapLinesRef.current.forEach(line => canvas.remove(line))
    snapLinesRef.current = []
  }, [canvas])

  const drawSnapLine = useCallback((x1, y1, x2, y2, color = '#ff0000') => {
    if (!canvas) return
    const line = new fabric.Line([x1, y1, x2, y2], {
      stroke: color,
      strokeWidth: 1 / zoom,
      selectable: false,
      evented: false,
      dashArray: [5 / zoom, 5 / zoom]
    })
    canvas.add(line)
    snapLinesRef.current.push(line)
  }, [canvas, zoom])

  const findSnaps = useCallback((obj) => {
    if (!canvas) return { snapped: false, props: {} }
    
    const effectiveTolerance = getEffectiveTolerance()
    const snaps = []
    const objects = canvas.getObjects().filter(o => o !== obj && o !== obj.group && !o.type.includes('snap'))
    
    const objCenterX = obj.left + (obj.width * obj.scaleX) / 2
    const objCenterY = obj.top + (obj.height * obj.scaleY) / 2
    const objLeft = obj.left
    const objRight = obj.left + obj.width * obj.scaleX
    const objTop = obj.top
    const objBottom = obj.top + obj.height * obj.scaleY
    
    // Use dynamic canvas dimensions for page center calculations
    const BASE_WIDTH = dimensions.width
    const BASE_HEIGHT = dimensions.height
    const canvasCenterX = BASE_WIDTH / 2
    const canvasCenterY = BASE_HEIGHT / 2
    
    if (Math.abs(objCenterX - canvasCenterX) < effectiveTolerance) {
      snaps.push({ type: 'page-center-x', value: canvasCenterX - (obj.width * obj.scaleX) / 2 })
      drawSnapLine(canvasCenterX, 0, canvasCenterX, BASE_HEIGHT, '#00ff00')
    }
    
    if (Math.abs(objCenterY - canvasCenterY) < effectiveTolerance) {
      snaps.push({ type: 'page-center-y', value: canvasCenterY - (obj.height * obj.scaleY) / 2 })
      drawSnapLine(0, canvasCenterY, BASE_WIDTH, canvasCenterY, '#00ff00')
    }
    
    objects.forEach(other => {
      const otherCenterX = other.left + (other.width * other.scaleX) / 2
      const otherCenterY = other.top + (other.height * other.scaleY) / 2
      const otherLeft = other.left
      const otherRight = other.left + other.width * other.scaleX
      const otherTop = other.top
      const otherBottom = other.top + other.height * other.scaleY
      
      const dx = objCenterX - otherCenterX
      const dy = objCenterY - otherCenterY
      
      if (Math.abs(dx) < effectiveTolerance) {
        snaps.push({ type: 'center-x', value: otherCenterX - obj.width * obj.scaleX / 2 })
        drawSnapLine(otherCenterX, 0, otherCenterX, canvas.height)
      }
      if (Math.abs(dy) < effectiveTolerance) {
        snaps.push({ type: 'center-y', value: otherCenterY - obj.height * obj.scaleY / 2 })
        drawSnapLine(0, otherCenterY, canvas.width, otherCenterY)
      }
      if (Math.abs(objLeft - otherLeft) < effectiveTolerance) {
        snaps.push({ type: 'left', value: otherLeft })
        drawSnapLine(otherLeft, 0, otherLeft, canvas.height)
      }
      if (Math.abs(objRight - otherRight) < effectiveTolerance) {
        snaps.push({ type: 'right', value: otherRight - obj.width * obj.scaleX })
        drawSnapLine(otherRight, 0, otherRight, canvas.height)
      }
      if (Math.abs(objTop - otherTop) < effectiveTolerance) {
        snaps.push({ type: 'top', value: otherTop })
        drawSnapLine(0, otherTop, canvas.width, otherTop)
      }
      if (Math.abs(objBottom - otherBottom) < effectiveTolerance) {
        snaps.push({ type: 'bottom', value: otherBottom - obj.height * obj.scaleY })
        drawSnapLine(0, otherBottom, canvas.width, otherBottom)
      }
      if (Math.abs(objLeft - otherRight) < effectiveTolerance) {
        snaps.push({ type: 'left-right', value: otherRight })
        drawSnapLine(otherRight, 0, otherRight, canvas.height)
      }
      if (Math.abs(objRight - otherLeft) < effectiveTolerance) {
        snaps.push({ type: 'right-left', value: otherLeft - obj.width * obj.scaleX })
        drawSnapLine(otherLeft, 0, otherLeft, canvas.height)
      }
      if (Math.abs(objTop - otherBottom) < effectiveTolerance) {
        snaps.push({ type: 'top-bottom', value: otherBottom })
        drawSnapLine(0, otherBottom, canvas.width, otherBottom)
      }
      if (Math.abs(objBottom - otherTop) < effectiveTolerance) {
        snaps.push({ type: 'bottom-top', value: otherTop - obj.height * obj.scaleY })
        drawSnapLine(0, otherTop, canvas.width, otherTop)
      }
    })
    
    if (snaps.length === 0) return { snapped: false, props: {} }
    
    const props = {}
    snaps.forEach(snap => {
      switch (snap.type) {
        case 'page-center-x':
          props.left = snap.value
          break
        case 'page-center-y':
          props.top = snap.value
          break
        case 'center-x':
          props.left = snap.value
          break
        case 'center-y':
          props.top = snap.value
          break
        case 'left':
          props.left = snap.value
          break
        case 'right':
          props.left = snap.value
          break
        case 'left-right':
          props.left = snap.value
          break
        case 'right-left':
          props.left = snap.value
          break
        case 'top':
          props.top = snap.value
          break
        case 'bottom':
          props.top = snap.value
          break
        case 'top-bottom':
          props.top = snap.value
          break
        case 'bottom-top':
          props.top = snap.value
          break
      }
    })
    
    return { snapped: true, props }
  }, [canvas, getEffectiveTolerance, drawSnapLine, dimensions])

  // Initialize canvas once when component mounts
  useEffect(() => {
    if (!initializedRef.current && canvasRef.current && currentPage && dimensions) {
      const canvasInstance = initCanvas(canvasRef.current, dimensions)
      initializedRef.current = true
    }
  }, [currentPage, dimensions, initCanvas])

  // Cleanup canvas only when component unmounts
  useEffect(() => {
    return () => {
      if (canvas && !canvas.isDisposed) {
        canvas.dispose()
        initializedRef.current = false
      }
    }
  }, [])

  // Update canvas dimensions when zoom changes
  useEffect(() => {
    if (canvas && dimensions) {
      canvas.setZoom(zoom)
      canvas.setWidth(dimensions.width * zoom)
      canvas.setHeight(dimensions.height * zoom)
      canvas.renderAll()
    }
  }, [zoom, canvas, dimensions])

  // Save current page data before switching and load new page data
  useEffect(() => {
    if (!canvas || !currentPage) return

    const currentPageId = currentPage.id

    // Only switch if we're actually changing pages
    if (previousPageIdRef.current !== currentPageId) {
      // Save data from previous page (if there was one)
      if (previousPageIdRef.current !== null) {
        const canvasData = canvas.toJSON(['linkUrl'])
        savePageData(previousPageIdRef.current, canvasData)
      }

      // Update canvas dimensions to match the new page
      const newDimensions = currentPage.dimensions || { width: 595.28, height: 841.89 }
      canvas.setWidth(newDimensions.width * zoom)
      canvas.setHeight(newDimensions.height * zoom)

      // Load data for current page
      const pageData = getPageData(currentPageId)
      if (pageData) {
        canvas.loadFromJSON(pageData, () => {
          canvas.renderAll()
        })
      } else {
        canvas.clear()
        canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas))
      }

      previousPageIdRef.current = currentPageId
    }
  }, [currentPage, canvas, savePageData, getPageData, zoom])

  useEffect(() => {
    if (!canvas) return

    const handleObjectMoving = (e) => {
      clearSnapLines()
      
      const obj = e.target
      const { snapped, props } = findSnaps(obj)
      
      if (snapped) {
        Object.assign(obj, props)
      }
    }

    const handleObjectModified = () => {
      clearSnapLines()
    }

    canvas.on('object:moving', handleObjectMoving)
    canvas.on('object:modified', handleObjectModified)

    return () => {
      canvas.off('object:moving', handleObjectMoving)
      canvas.off('object:modified', handleObjectModified)
      clearSnapLines()
    }
  }, [canvas, clearSnapLines, findSnaps])

  const handleCloseContextMenu = () => {
    setContextMenu({ isOpen: false, x: 0, y: 0 })
  }

  return (
    <>
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>
      <HelpMenu isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={{ x: contextMenu.x, y: contextMenu.y }}
        onClose={handleCloseContextMenu}
        selectedObject={selectedObject}
        onSetLink={setObjectLink}
        onRemoveLink={removeObjectLink}
        onAddShadow={addObjectShadow}
        onRemoveShadow={removeObjectShadow}
        onDuplicate={duplicateSelected}
        onDelete={deleteSelected}
        onBringToFront={bringToFront}
        onSendToBack={sendToBack}
      />
    </>
  )
}

export default DesignCanvas