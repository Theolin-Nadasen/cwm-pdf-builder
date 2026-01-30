import React, { useEffect, useRef, useCallback } from 'react'
import { useFabric } from '../../context/FabricContext'
import { useDocument } from '../../context/DocumentContext'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { fabric } from 'fabric'

function DesignCanvas({ zoom }) {
  const { canvas, setCanvas, initCanvas, deleteSelected, undo, redo } = useFabric()
  const { currentPageIndex, currentPage, savePageData, getPageData } = useDocument()
  const canvasRef = useRef(null)
  const initializedRef = useRef(false)
  const snapLinesRef = useRef([])
  const previousPageIdRef = useRef(null)

  useEffect(() => {
    if (!initializedRef.current && canvasRef.current) {
      const canvasInstance = initCanvas(canvasRef.current, {
        width: 595.28,
        height: 841.89,
        backgroundColor: '#ffffff',
        selectionKey: 'ctrlKey'
      })
      initializedRef.current = true
    }

    return () => {
      if (canvas && !canvas.isDisposed) {
        canvas.dispose()
      }
    }
  }, [])

  useKeyboardShortcuts({
    onDelete: deleteSelected,
    onUndo: undo,
    onRedo: redo
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
    
    // Use base canvas dimensions (unzoomed) for page center calculations
    // Object positions are stored in unzoomed coordinate space
    const BASE_WIDTH = 595.28
    const BASE_HEIGHT = 841.89
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
  }, [canvas, getEffectiveTolerance, drawSnapLine])

  useEffect(() => {
    if (!initializedRef.current && canvasRef.current) {
      const canvasInstance = initCanvas(canvasRef.current, {
        width: 595.28,
        height: 841.89,
        backgroundColor: '#ffffff',
        selectionKey: 'ctrlKey'
      })
      initializedRef.current = true
    }

    return () => {
      if (canvas && !canvas.isDisposed) {
        canvas.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (canvas) {
      canvas.setZoom(zoom)
      canvas.setWidth(595.28 * zoom)
      canvas.setHeight(841.89 * zoom)
      canvas.renderAll()
    }
  }, [zoom, canvas])

  // Save current page data before switching and load new page data
  useEffect(() => {
    if (!canvas || !currentPage) return

    const currentPageId = currentPage.id

    // Only switch if we're actually changing pages
    if (previousPageIdRef.current !== currentPageId) {
      // Save data from previous page (if there was one)
      if (previousPageIdRef.current !== null) {
        const canvasData = canvas.toJSON()
        savePageData(previousPageIdRef.current, canvasData)
      }

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
  }, [currentPage, canvas, savePageData, getPageData])

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

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default DesignCanvas