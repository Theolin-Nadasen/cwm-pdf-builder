import jsPDF from 'jspdf'

// Page size definitions (width x height in mm)
export const PDF_PAGE_SIZES = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },
  flyer: { width: 127, height: 178 },
  business: { width: 89, height: 51 },
  a5: { width: 148, height: 210 }
}

// DPI constant
const DPI = 72

// Helper to convert mm to pixels
const mmToPixels = (mm) => mm * (DPI / 25.4)

// Helper function to convert canvas coordinates to PDF coordinates
function canvasToPdfCoordinates(obj, canvasWidth, canvasHeight, pdfWidth, pdfHeight) {
  // Get object properties
  const width = (obj.width || 0) * (obj.scaleX || 1)
  const height = (obj.height || 0) * (obj.scaleY || 1)
  const left = obj.left || 0
  const top = obj.top || 0
  
  // Check origin (fabric uses 'center' by default for most objects)
  const originX = obj.originX || 'center'
  const originY = obj.originY || 'center'
  
  // Convert to PDF coordinates (mm)
  const scaleX = pdfWidth / canvasWidth
  const scaleY = pdfHeight / canvasHeight

  // Calculate top-left corner based on origin
  let x, y
  
  if (originX === 'center') {
    x = left - width / 2
  } else if (originX === 'right') {
    x = left - width
  } else {
    // originX === 'left' or default
    x = left
  }
  
  if (originY === 'center') {
    y = top - height / 2
  } else if (originY === 'bottom') {
    y = top - height
  } else {
    // originY === 'top' or default
    y = top
  }

  // Convert to PDF mm coordinates
  // Note: PDF y=0 is at the bottom, canvas y=0 is at the top
  // But since we're placing an image at y=0 that covers from top to bottom,
  // we use the same coordinate system as the image
  return {
    x: Math.max(0, x * scaleX),
    y: Math.max(0, y * scaleY),
    width: Math.max(1, width * scaleX),
    height: Math.max(1, height * scaleY)
  }
}

export async function generatePDFFromPages(pagesData, options = {}) {
  const { 
    filename = 'document.pdf'
  } = options

  // Create PDF - we'll set the page size for each page individually
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4' // Default, will be overridden per page
  })

  for (let i = 0; i < pagesData.length; i++) {
    if (i > 0) {
      pdf.addPage()
    }

    const pageData = pagesData[i]

    try {
      if (pageData && pageData.objects && pageData.objects.length > 0) {
        // Get page size from the page data or use default
        const pageSize = pageData.pageSize || 'a4'
        const orientation = pageData.orientation || 'portrait'
        const sizeData = PDF_PAGE_SIZES[pageSize] || PDF_PAGE_SIZES.a4
        
        // Calculate dimensions based on orientation
        let pageWidth = sizeData.width
        let pageHeight = sizeData.height
        
        if (orientation === 'landscape') {
          [pageWidth, pageHeight] = [pageHeight, pageWidth]
        }
        
        // Update the current page size in the PDF
        pdf.internal.pageSize.width = pageWidth
        pdf.internal.pageSize.height = pageHeight
        
        // Create a temporary canvas with the correct dimensions
        const dimensions = pageData.dimensions || {
          width: mmToPixels(orientation === 'landscape' ? sizeData.height : sizeData.width),
          height: mmToPixels(orientation === 'landscape' ? sizeData.width : sizeData.height)
        }
        
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = dimensions.width
        tempCanvas.height = dimensions.height
        const ctx = tempCanvas.getContext('2d')
        
        // Fill white background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
        
        // Render fabric objects to canvas
        const { fabric } = await import('fabric')
        const fabricCanvas = new fabric.Canvas(tempCanvas)
        
        await new Promise((resolve) => {
          fabricCanvas.loadFromJSON(pageData, () => {
            fabricCanvas.renderAll()
            resolve()
          })
        })

        const canvasDataUrl = tempCanvas.toDataURL('image/png', 1.0)

        const imgWidth = pageWidth
        const imgHeight = (tempCanvas.height * pageWidth) / tempCanvas.width

        pdf.addImage(canvasDataUrl, 'PNG', 0, 0, imgWidth, imgHeight)
        
        // Add clickable links for objects with linkUrl
        const objects = fabricCanvas.getObjects()
        let linkCount = 0
        objects.forEach(obj => {
          if (obj.linkUrl) {
            linkCount++
            const coords = canvasToPdfCoordinates(
              obj, 
              tempCanvas.width, 
              tempCanvas.height, 
              pageWidth, 
              imgHeight
            )
            
            console.log(`Adding link to PDF: ${obj.linkUrl} at (${coords.x.toFixed(1)}, ${coords.y.toFixed(1)}) size ${coords.width.toFixed(1)}x${coords.height.toFixed(1)}mm`)
            
            // Add link annotation
            pdf.link(
              coords.x, 
              coords.y, 
              coords.width, 
              coords.height, 
              { url: obj.linkUrl }
            )
          }
        })
        console.log(`Total links added to page ${i + 1}: ${linkCount}`)
        
        fabricCanvas.dispose()
      } else {
        // Empty page - just add blank white page
        // pdf is already white by default, so nothing to do
      }
    } catch (error) {
      console.error(`Error generating page ${i + 1}:`, error)
    }
  }

  pdf.save(filename)
  return pdf
}

export async function generatePDFFromCanvas(canvas) {
  if (!canvas) return null

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = 210
  const pageHeight = 297

  const canvasDataUrl = canvas.toDataURL({
    format: 'png',
    quality: 1
  })

  const imgWidth = pageWidth
  const imgHeight = (canvas.height * pageWidth) / canvas.width

  pdf.addImage(canvasDataUrl, 'PNG', 0, 0, imgWidth, imgHeight)
  
  // Add clickable links for objects with linkUrl
  const objects = canvas.getObjects()
  let linkCount = 0
  objects.forEach(obj => {
    if (obj.linkUrl) {
      linkCount++
      const coords = canvasToPdfCoordinates(
        obj, 
        canvas.width, 
        canvas.height, 
        pageWidth, 
        imgHeight
      )
      
      console.log(`Adding link to PDF: ${obj.linkUrl} at (${coords.x.toFixed(1)}, ${coords.y.toFixed(1)}) size ${coords.width.toFixed(1)}x${coords.height.toFixed(1)}mm`)
      
      // Add link annotation
      pdf.link(
        coords.x, 
        coords.y, 
        coords.width, 
        coords.height, 
        { url: obj.linkUrl }
      )
    }
  })
  console.log(`Total links added: ${linkCount}`)
  
  pdf.save('document.pdf')

  return pdf
}

export function getPageSize(size) {
  return PDF_PAGE_SIZES[size] || PDF_PAGE_SIZES.a4
}