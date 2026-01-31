import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const DocumentContext = createContext(null)

// Page size definitions (width x height in mm)
export const PAGE_SIZES = {
  a4: { name: 'A4', width: 210, height: 297, icon: 'A4' },
  letter: { name: 'Letter', width: 216, height: 279, icon: 'LET' },
  legal: { name: 'Legal', width: 216, height: 356, icon: 'LEG' },
  flyer: { name: 'Flyer/Card', width: 127, height: 178, icon: 'FLY' },
  business: { name: 'Business Card', width: 89, height: 51, icon: 'BUS' },
  a5: { name: 'A5', width: 148, height: 210, icon: 'A5' }
}

// DPI constant for pixel calculations
const DPI = 72

// Helper to convert mm to pixels
export const mmToPixels = (mm) => mm * (DPI / 25.4)

// Helper to get canvas dimensions from page size
export const getCanvasDimensions = (pageSize, orientation = 'portrait') => {
  const size = PAGE_SIZES[pageSize] || PAGE_SIZES.a4
  let width = mmToPixels(size.width)
  let height = mmToPixels(size.height)
  
  if (orientation === 'landscape') {
    [width, height] = [height, width]
  }
  
  return { width, height, widthMm: orientation === 'landscape' ? size.height : size.width, heightMm: orientation === 'landscape' ? size.width : size.height }
}

const createEmptyPage = (id, pageSize = 'a4', orientation = 'portrait') => {
  const dimensions = getCanvasDimensions(pageSize, orientation)
  return {
    id: id || Date.now(),
    canvasData: null,
    thumbnail: null,
    pageSize: pageSize,
    orientation: orientation,
    dimensions: dimensions
  }
}

const getDefaultZoom = () => {
  // Desktop: 70%, Mobile: 40%
  return window.innerWidth <= 768 ? 0.4 : 0.7
}

export const DocumentProvider = ({ children }) => {
  const [pages, setPages] = useState([])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [zoom, setZoom] = useState(getDefaultZoom())
  const [showTemplateModal, setShowTemplateModal] = useState(true)
  const canvasDataRef = useRef({})

  const initializeDocument = useCallback((pageSize, orientation) => {
    const newPage = createEmptyPage(1, pageSize, orientation)
    setPages([newPage])
    setCurrentPageIndex(0)
    setShowTemplateModal(false)
  }, [])

  const addPage = useCallback(() => {
    if (pages.length === 0) return
    const currentPage = pages[currentPageIndex]
    const newPage = createEmptyPage(pages.length + 1, currentPage.pageSize, currentPage.orientation)
    setPages(prev => [...prev, newPage])
  }, [pages, currentPageIndex])

  const deletePage = useCallback((index) => {
    if (pages.length > 1) {
      // Remove canvas data for deleted page
      const newCanvasData = { ...canvasDataRef.current }
      delete newCanvasData[pages[index].id]
      canvasDataRef.current = newCanvasData
      
      setPages(prev => prev.filter((_, i) => i !== index))
      if (index === currentPageIndex) {
        setCurrentPageIndex(0)
      } else if (index < currentPageIndex) {
        setCurrentPageIndex(prev => prev - 1)
      }
    }
  }, [pages.length, currentPageIndex])

  const selectPage = useCallback((index) => {
    setCurrentPageIndex(index)
  }, [])

  const movePage = useCallback((fromIndex, toIndex) => {
    const newPages = [...pages]
    const [movedPage] = newPages.splice(fromIndex, 1)
    newPages.splice(toIndex, 0, movedPage)
    setPages(newPages)
    
    if (currentPageIndex === fromIndex) {
      setCurrentPageIndex(toIndex)
    } else if (fromIndex < currentPageIndex && toIndex >= currentPageIndex) {
      setCurrentPageIndex(prev => prev - 1)
    } else if (fromIndex > currentPageIndex && toIndex <= currentPageIndex) {
      setCurrentPageIndex(prev => prev + 1)
    }
  }, [pages, currentPageIndex])

  const updateZoom = useCallback((newZoom) => {
    setZoom(Math.min(Math.max(newZoom, 0.25), 3))
  }, [])

  const savePageData = useCallback((pageId, canvasData) => {
    canvasDataRef.current[pageId] = canvasData
  }, [])

  const getPageData = useCallback((pageId) => {
    return canvasDataRef.current[pageId] || null
  }, [])

  const value = {
    pages,
    setPages,
    currentPageIndex,
    setCurrentPageIndex,
    currentPage: pages[currentPageIndex] || null,
    addPage,
    deletePage,
    selectPage,
    movePage,
    zoom,
    updateZoom,
    savePageData,
    getPageData,
    canvasDataRef,
    showTemplateModal,
    setShowTemplateModal,
    initializeDocument,
    PAGE_SIZES
  }

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  )
}

export const useDocument = () => {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider')
  }
  return context
}