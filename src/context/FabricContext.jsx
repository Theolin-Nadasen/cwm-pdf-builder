import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { fabric } from 'fabric'

const FabricContext = createContext(null)

export const FabricProvider = ({ children }) => {
  const [canvas, setCanvas] = useState(null)
  const [selectedObject, setSelectedObject] = useState(null)
  const [selectedObjects, setSelectedObjects] = useState([])
  const [updateKey, setUpdateKey] = useState(0)
  const historyRef = useRef([])
  const historyIndexRef = useRef(-1)
  const isUndoingRef = useRef(false)

  const initCanvas = useCallback((canvasEl, dimensions = { width: 595.28, height: 841.89 }) => {
    const canvasInstance = new fabric.Canvas(canvasEl, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true
    })

    canvasInstance.on('selection:created', (e) => {
      const objects = e.selected || []
      setSelectedObjects(objects)
      
      const obj = objects[0]
      if (obj) {
        obj.on('modified', () => {
          setUpdateKey(prev => prev + 1)
          if (!isUndoingRef.current) {
            saveState(canvasInstance)
          }
        })
        obj.on('scaling', () => setUpdateKey(prev => prev + 1))
        obj.on('moving', () => setUpdateKey(prev => prev + 1))
        obj.on('rotating', () => setUpdateKey(prev => prev + 1))
      }
      setSelectedObject(obj || null)
    })

    canvasInstance.on('selection:updated', (e) => {
      const objects = e.selected || []
      setSelectedObjects(objects)
      const obj = objects[0]
      setSelectedObject(obj || null)
    })

    canvasInstance.on('selection:cleared', () => {
      setSelectedObject(null)
      setSelectedObjects([])
    })

    canvasInstance.on('object:added', () => {
      if (!isUndoingRef.current) {
        saveState(canvasInstance)
      }
    })

    canvasInstance.on('object:removed', () => {
      if (!isUndoingRef.current) {
        saveState(canvasInstance)
      }
    })

    canvasInstance.on('object:modified', () => {
      canvasInstance.renderAll()
    })

    setCanvas(canvasInstance)
    saveState(canvasInstance)
    return canvasInstance
  }, [])

  const saveState = useCallback((canvasInstance) => {
    const json = canvasInstance.toJSON(['linkUrl'])
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
    historyRef.current.push(json)
    historyIndexRef.current = historyRef.current.length - 1
    
    if (historyRef.current.length > 50) {
      historyRef.current.shift()
      historyIndexRef.current--
    }
  }, [])

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0 && canvas) {
      isUndoingRef.current = true
      historyIndexRef.current--
      canvas.loadFromJSON(historyRef.current[historyIndexRef.current], () => {
        canvas.renderAll()
        isUndoingRef.current = false
      })
    }
  }, [canvas])

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1 && canvas) {
      isUndoingRef.current = true
      historyIndexRef.current++
      canvas.loadFromJSON(historyRef.current[historyIndexRef.current], () => {
        canvas.renderAll()
        isUndoingRef.current = false
      })
    }
  }, [canvas])

  const updateObject = useCallback((props) => {
    if (canvas && selectedObject) {
      if (selectedObject.type === 'table') {
        selectedObject.set(props)
        selectedObject.setCoords()
      } else {
        selectedObject.set(props)
        selectedObject.setCoords()
      }
      canvas.renderAll()
    }
  }, [canvas, selectedObject])

  const deleteSelected = useCallback(() => {
    if (canvas) {
      const activeObjects = canvas.getActiveObjects()
      activeObjects.forEach(obj => canvas.remove(obj))
      canvas.discardActiveObject()
      canvas.renderAll()
      setSelectedObject(null)
    }
  }, [canvas])

  const duplicateSelected = useCallback(() => {
    if (!canvas) return
    
    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length === 0) return
    
    if (activeObjects.length === 1) {
      // Single object duplication
      const obj = activeObjects[0]
      obj.clone((cloned) => {
        cloned.set({
          left: obj.left + 20,
          top: obj.top + 20,
          linkUrl: obj.linkUrl
        })
        canvas.add(cloned)
        canvas.setActiveObject(cloned)
        canvas.renderAll()
      })
    } else {
      // Multiple objects duplication
      const clonedObjects = []
      let cloneCount = 0
      
      activeObjects.forEach((obj) => {
        obj.clone((cloned) => {
          cloned.set({
            left: obj.left + 20,
            top: obj.top + 20,
            linkUrl: obj.linkUrl
          })
          canvas.add(cloned)
          clonedObjects.push(cloned)
          cloneCount++
          
          // When all objects are cloned, create selection
          if (cloneCount === activeObjects.length) {
            const selection = new fabric.ActiveSelection(clonedObjects, {
              canvas: canvas
            })
            canvas.setActiveObject(selection)
            canvas.renderAll()
          }
        })
      })
    }
  }, [canvas])

  const bringToFront = useCallback(() => {
    if (canvas && selectedObject) {
      canvas.bringToFront(selectedObject)
      canvas.renderAll()
    }
  }, [canvas, selectedObject])

  const sendToBack = useCallback(() => {
    if (canvas && selectedObject) {
      canvas.sendToBack(selectedObject)
      canvas.renderAll()
    }
  }, [canvas, selectedObject])

  const ungroupSelected = useCallback(() => {
    if (canvas && selectedObject && selectedObject.type === 'table') {
      const items = selectedObject.getObjects()
      canvas.remove(selectedObject)
      items.forEach(item => {
        item.set({
          selectable: true,
          left: item.left + selectedObject.left,
          top: item.top + selectedObject.top
        })
        canvas.add(item)
      })
      canvas.discardActiveObject()
      canvas.renderAll()
      setSelectedObject(null)
    }
  }, [canvas, selectedObject])

  const setObjectLink = useCallback((url) => {
    if (canvas && selectedObject) {
      let normalizedUrl = url.trim()
      // Add https:// if no protocol is specified
      if (normalizedUrl && !normalizedUrl.match(/^https?:\/\//i) && !normalizedUrl.match(/^mailto:/i)) {
        normalizedUrl = 'https://' + normalizedUrl
      }
      selectedObject.set('linkUrl', normalizedUrl)
      selectedObject.setCoords()
      canvas.renderAll()
    }
  }, [canvas, selectedObject])

  const removeObjectLink = useCallback(() => {
    if (canvas && selectedObject) {
      selectedObject.set('linkUrl', null)
      selectedObject.setCoords()
      canvas.renderAll()
    }
  }, [canvas, selectedObject])

  const addObjectShadow = useCallback(() => {
    if (canvas && selectedObject) {
      selectedObject.set({
        shadow: {
          color: 'rgba(0,0,0,0.3)',
          blur: 10,
          offsetX: 5,
          offsetY: 5,
          affectStroke: false
        }
      })
      selectedObject.setCoords()
      canvas.renderAll()
    }
  }, [canvas, selectedObject])

  const removeObjectShadow = useCallback(() => {
    if (canvas && selectedObject) {
      selectedObject.set({ shadow: null })
      selectedObject.setCoords()
      canvas.renderAll()
    }
  }, [canvas, selectedObject])

  const value = {
    canvas,
    setCanvas,
    selectedObject,
    setSelectedObject,
    selectedObjects,
    initCanvas,
    updateObject,
    deleteSelected,
    duplicateSelected,
    bringToFront,
    sendToBack,
    ungroupSelected,
    setObjectLink,
    removeObjectLink,
    addObjectShadow,
    removeObjectShadow,
    undo,
    redo,
    updateKey
  }

  return (
    <FabricContext.Provider value={value}>
      {children}
    </FabricContext.Provider>
  )
}

export const useFabric = () => {
  const context = useContext(FabricContext)
  if (!context) {
    throw new Error('useFabric must be used within a FabricProvider')
  }
  return context
}
