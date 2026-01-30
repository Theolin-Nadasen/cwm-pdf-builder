# PDF Builder

A modern, full-featured PDF builder application built with React and Fabric.js. Design and export PDF documents directly in your browser with drag-and-drop elements, text, shapes, images, and tables.

## Features

### Design Elements
- **Text**: Add and edit text with multiple fonts, sizes, colors, and styles (bold, italic, underline)
- **Shapes**: Add rectangles, circles, lines, and triangles with customizable colors and strokes
- **Images**: Upload and insert images from your computer
- **Tables**: Create customizable tables with rows and columns

### Canvas Features
- Drag and drop elements
- Resize and rotate elements
- Layer management (bring to front/send to back)
- Duplicate and delete elements
- Zoom in/out functionality

### Multi-page Support
- Add multiple pages to your document
- Navigate between pages using thumbnails
- Delete pages
- Each page has its own canvas

### PDF Export
- Export your designs as PDF files
- High-quality output using jsPDF and html2canvas
- A4 page format

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Fabric.js** - Canvas manipulation library
- **jsPDF** - PDF generation
- **html2canvas** - Canvas-to-image conversion

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Add Elements**: Click on the tools in the left sidebar to add text, shapes, images, or tables
2. **Edit Elements**: Click on an element to select it, then edit its properties in the right panel
3. **Move/Resize**: Drag elements to move them, use the handles to resize
4. **Rotate**: Use the rotation handle above selected elements
5. **Manage Layers**: Use "Bring to Front" or "Send to Back" to manage element stacking
6. **Add Pages**: Click "Add Page" to create new pages
7. **Export PDF**: Click "Export PDF" to download your document as a PDF file

## Project Structure

```
src/
├── components/
│   ├── Canvas/
│   │   └── DesignCanvas.jsx     # Main Fabric.js canvas
│   ├── Layout/
│   │   ├── Layout.jsx           # Main layout container
│   │   ├── Topbar.jsx           # Top navigation bar
│   │   ├── Sidebar.jsx          # Left sidebar with tools
│   │   ├── CanvasArea.jsx       # Canvas display area
│   │   └── PropertiesPanel.jsx  # Right properties panel
│   ├── Pages/
│   │   └── PageNavigator.jsx    # Page navigation
│   ├── Properties/
│   │   ├── TextProperties.jsx   # Text element properties
│   │   ├── ShapeProperties.jsx  # Shape element properties
│   │   └── ImageProperties.jsx  # Image element properties
│   └── Toolbar/
│       ├── TextTools.jsx        # Text tools
│       ├── ShapeTools.jsx       # Shape tools
│       ├── ImageTools.jsx       # Image upload tools
│       └── TableTools.jsx       # Table creation tools
├── context/
│   ├── FabricContext.jsx        # Fabric.js state management
│   └── DocumentContext.jsx      # Document/page state management
├── utils/
│   └── pdfGenerator.js          # PDF generation utilities
├── App.jsx                      # Main app component
└── main.jsx                     # Entry point
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT
