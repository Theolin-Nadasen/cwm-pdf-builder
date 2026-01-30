import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const DocumentContext = createContext(null)

const createEmptyPage = (id) => ({
  id: id || Date.now(),
  canvasData: null,
  thumbnail: null
})

const getDefaultZoom = () => {
  // Desktop: 70%, Mobile: 40%
  return window.innerWidth <= 768 ? 0.4 : 0.7
}

export const DocumentProvider = ({ children }) => {
  const [pages, setPages] = useState([createEmptyPage(1)])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [zoom, setZoom] = useState(getDefaultZoom())
  const canvasDataRef = useRef({})

  const addPage = useCallback(() => {
    const newPage = createEmptyPage(pages.length + 1)
    setPages(prev => [...prev, newPage])
  }, [pages.length])

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
    currentPage: pages[currentPageIndex],
    addPage,
    deletePage,
    selectPage,
    movePage,
    zoom,
    updateZoom,
    savePageData,
    getPageData,
    canvasDataRef
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