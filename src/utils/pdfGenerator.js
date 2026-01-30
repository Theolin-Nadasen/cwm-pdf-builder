import jsPDF from 'jspdf'

export async function generatePDFFromPages(pagesData, options = {}) {
  const { 
    filename = 'document.pdf',
    pageSize = 'a4',
    orientation = 'portrait' 
  } = options

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize
  })

  const pageWidth = orientation === 'portrait' ? 210 : 297
  const pageHeight = orientation === 'portrait' ? 297 : 210

  for (let i = 0; i < pagesData.length; i++) {
    if (i > 0) {
      pdf.addPage()
    }

    const pageData = pagesData[i]

    try {
      if (pageData && pageData.objects && pageData.objects.length > 0) {
        // Create a temporary canvas to render the page
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = 595.28
        tempCanvas.height = 841.89
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
  pdf.save('document.pdf')

  return pdf
}

export function getPageSize(size) {
  const sizes = {
    a4: { width: 210, height: 297 },
    letter: { width: 216, height: 279 },
    legal: { width: 216, height: 356 }
  }
  return sizes[size] || sizes.a4
}