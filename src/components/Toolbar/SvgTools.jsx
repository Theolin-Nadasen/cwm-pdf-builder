import React, { useState, useRef } from 'react'
import { useFabric } from '../../context/FabricContext'
import { fabric } from 'fabric'
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown, 
  ChevronLeft, ChevronRight, Move, RefreshCw, RotateCcw, Maximize,
  Star, Heart, Circle, Square, Triangle, Hexagon, Pentagon, Octagon,
  MessageSquare, Phone, Mail, Bell, Megaphone, Send, MessageCircle,
  Briefcase, TrendingUp, BarChart3, PieChart, Calendar, Clock, DollarSign,
  Check, X, AlertCircle, Info, Settings, Search, Filter, MoreHorizontal,
  FileText, Clipboard, Copy, Save, Download, Upload, Folder, Trash2,
  Plus, Minus, Sun, Moon, Home, User, Lock, Unlock, Shield, Zap, Flag,
  Bookmark, Tag, Link, Paperclip, Image as ImageIcon, Video, Music,
  Printer, Share2, Eye, EyeOff, Edit3, PenTool, Scissors, Crop,
  Maximize2, Minimize2, Expand, Shrink, Grid, Layout, Columns, Rows
} from 'lucide-react'

// Convert Lucide icon to SVG path string
const getIconSvg = (IconComponent) => {
  // Create a temporary div to render the icon
  const tempDiv = document.createElement('div')
  // This is a workaround - we'll manually construct the path from common Lucide icons
  // Since we can't easily extract SVG path from React components, we'll use a mapping
  return null
}

// SVG path mappings for Lucide icons
const svgPaths = {
  // Arrows
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  arrowDown: 'M12 5v14M5 12l7 7 7-7',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  chevronUp: 'M18 15l-6-6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  move: 'M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  maximize: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
  
  // Shapes
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  heart: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  circle: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
  square: 'M3 3h18v18H3z',
  triangle: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  hexagon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  
  // Communication
  message: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  phone: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
  megaphone: 'M3 11l18-5v12L3 14v-3z M11.6 16.8a3 3 0 11-5.8-1.6',
  
  // Business
  briefcase: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16',
  trendingUp: 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
  barChart: 'M18 20V10M12 20V4M6 20v-6',
  pieChart: 'M21.21 15.89A10 10 0 118 2.83 M22 12A10 10 0 0012 2v10z',
  calendar: 'M4 4h16c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M16 2v4M8 2v4M4 10h16',
  
  // UI
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  alert: 'M12 9v4 M12 17h.01 M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  info: 'M12 16v-4 M12 8h.01 M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
  search: 'M11 19A8 8 0 1111 3a8 8 0 010 16z M21 21l-4.35-4.35',
  
  // Document
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8M16 17H8M10 9H8',
  clipboard: 'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2 M16 2v4M8 2v4',
  copy: 'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2 M16 18V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2z',
  save: 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8V3',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  upload: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  
  // Symbols
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  sun: 'M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z',
  moon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
  lock: 'M19 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2z M17 11V7a5 5 0 00-10 0v4',
  unlock: 'M19 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2z M17 11V7a5 5 0 00-10 0 M12 15v4',
  
  // Misc
  flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
  bookmark: 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  paperclip: 'M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48',
  image: 'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z M8.5 13.5l2.5 2.5 4-4 5 5 M3 16l5-5 3 3',
  printer: 'M6 9V2h12v7 M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2 M6 14h12v8H6z',
  share: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8 M16 6l-4-4-4 4 M12 2v13',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z',
  eyeOff: 'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24 M1 1l22 22',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  crop: 'M6.13 1L6 16a2 2 0 002 2h15 M1 6.13L16 6a2 2 0 012 2v15',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  layout: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M4 9h16',
  columns: 'M12 3h7a2 2 0 012 2v14a2 2 0 01-2 2h-7M12 3H5a2 2 0 00-2 2v14a2 2 0 002 2h7',
  rows: 'M3 6h18M3 12h18M3 18h18'
}

// Icon categories configuration
const iconCategories = [
  {
    name: 'Arrows',
    icons: [
      { name: 'Arrow Up', path: svgPaths.arrowUp },
      { name: 'Arrow Down', path: svgPaths.arrowDown },
      { name: 'Arrow Left', path: svgPaths.arrowLeft },
      { name: 'Arrow Right', path: svgPaths.arrowRight },
      { name: 'Chevron Up', path: svgPaths.chevronUp },
      { name: 'Chevron Down', path: svgPaths.chevronDown },
      { name: 'Chevron Left', path: svgPaths.chevronLeft },
      { name: 'Chevron Right', path: svgPaths.chevronRight },
      { name: 'Move', path: svgPaths.move },
      { name: 'Refresh', path: svgPaths.refresh },
      { name: 'Maximize', path: svgPaths.maximize }
    ]
  },
  {
    name: 'Shapes',
    icons: [
      { name: 'Star', path: svgPaths.star },
      { name: 'Heart', path: svgPaths.heart },
      { name: 'Circle', path: svgPaths.circle },
      { name: 'Square', path: svgPaths.square },
      { name: 'Triangle', path: svgPaths.triangle },
      { name: 'Hexagon', path: svgPaths.hexagon }
    ]
  },
  {
    name: 'Communication',
    icons: [
      { name: 'Message', path: svgPaths.message },
      { name: 'Phone', path: svgPaths.phone },
      { name: 'Mail', path: svgPaths.mail },
      { name: 'Bell', path: svgPaths.bell },
      { name: 'Megaphone', path: svgPaths.megaphone }
    ]
  },
  {
    name: 'Business',
    icons: [
      { name: 'Briefcase', path: svgPaths.briefcase },
      { name: 'Trending Up', path: svgPaths.trendingUp },
      { name: 'Bar Chart', path: svgPaths.barChart },
      { name: 'Pie Chart', path: svgPaths.pieChart },
      { name: 'Calendar', path: svgPaths.calendar }
    ]
  },
  {
    name: 'UI',
    icons: [
      { name: 'Check', path: svgPaths.check },
      { name: 'X', path: svgPaths.x },
      { name: 'Alert', path: svgPaths.alert },
      { name: 'Info', path: svgPaths.info },
      { name: 'Settings', path: svgPaths.settings },
      { name: 'Search', path: svgPaths.search }
    ]
  },
  {
    name: 'Document',
    icons: [
      { name: 'File', path: svgPaths.file },
      { name: 'Clipboard', path: svgPaths.clipboard },
      { name: 'Copy', path: svgPaths.copy },
      { name: 'Save', path: svgPaths.save },
      { name: 'Download', path: svgPaths.download },
      { name: 'Upload', path: svgPaths.upload }
    ]
  },
  {
    name: 'Symbols',
    icons: [
      { name: 'Plus', path: svgPaths.plus },
      { name: 'Minus', path: svgPaths.minus },
      { name: 'Sun', path: svgPaths.sun },
      { name: 'Moon', path: svgPaths.moon },
      { name: 'Home', path: svgPaths.home },
      { name: 'User', path: svgPaths.user },
      { name: 'Lock', path: svgPaths.lock },
      { name: 'Unlock', path: svgPaths.unlock }
    ]
  },
  {
    name: 'Misc',
    icons: [
      { name: 'Flag', path: svgPaths.flag },
      { name: 'Bookmark', path: svgPaths.bookmark },
      { name: 'Tag', path: svgPaths.tag },
      { name: 'Link', path: svgPaths.link },
      { name: 'Paperclip', path: svgPaths.paperclip },
      { name: 'Image', path: svgPaths.image },
      { name: 'Printer', path: svgPaths.printer },
      { name: 'Share', path: svgPaths.share },
      { name: 'Eye', path: svgPaths.eye },
      { name: 'Edit', path: svgPaths.edit },
      { name: 'Crop', path: svgPaths.crop },
      { name: 'Grid', path: svgPaths.grid },
      { name: 'Layout', path: svgPaths.layout }
    ]
  }
]

function SvgTools() {
  const { canvas } = useFabric()
  const [selectedCategory, setSelectedCategory] = useState('Arrows')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const fileInputRef = useRef(null)

  const addSvgPath = (pathData, name) => {
    if (!canvas) return

    // Check if this is a filled shape or a stroke-based icon
    const filledShapes = ['star', 'heart', 'circle', 'square', 'triangle', 'hexagon']
    const isFilledShape = filledShapes.some(shape => name.toLowerCase().includes(shape))
    
    // Create a fabric Path from the SVG path data
    const path = new fabric.Path(pathData, {
      left: 100,
      top: 100,
      fill: isFilledShape ? '#6c68fb' : 'transparent',
      stroke: '#6c68fb',
      strokeWidth: isFilledShape ? 0 : 2,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      scaleX: 2,
      scaleY: 2,
      originX: 'center',
      originY: 'center'
    })

    // Center the path
    path.set({
      left: 100 + path.width / 2,
      top: 100 + path.height / 2
    })

    canvas.add(path)
    canvas.setActiveObject(path)
    canvas.renderAll()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file || !canvas) return

    if (!file.name.endsWith('.svg')) {
      alert('Please upload an SVG file')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const svgString = event.target.result
      
      // Load SVG into Fabric
      fabric.loadSVGFromString(svgString, (objects, options) => {
        const svgGroup = fabric.util.groupSVGElements(objects, options)
        
        // Set initial position and scale
        svgGroup.set({
          left: 100,
          top: 100,
          scaleX: 1,
          scaleY: 1
        })
        
        canvas.add(svgGroup)
        canvas.setActiveObject(svgGroup)
        canvas.renderAll()
      })
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const currentCategory = iconCategories.find(cat => cat.name === selectedCategory)

  return (
    <div className="space-y-3">
      {/* Category Dropdown */}
      <div className="relative">
        <button
          className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-[12px] font-semibold flex items-center justify-between hover:bg-white/30 transition-all"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span>{selectedCategory}</span>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-white/20 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {iconCategories.map((category) => (
              <button
                key={category.name}
                className={`w-full px-3 py-2 text-left text-[12px] hover:bg-white/10 transition-all ${
                  selectedCategory === category.name ? 'bg-white/20 text-white' : 'text-white/80'
                }`}
                onClick={() => {
                  setSelectedCategory(category.name)
                  setIsDropdownOpen(false)
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Icons Grid */}
      <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
        {currentCategory?.icons.map((icon) => (
          <button
            key={icon.name}
            className="flex flex-col items-center justify-center p-2 md:p-3 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 hover:border-white/50 transition-all group"
            onClick={() => addSvgPath(icon.path, icon.name)}
            title={icon.name}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform"
            >
              <path d={icon.path} />
            </svg>
          </button>
        ))}
      </div>

      {/* Upload Button */}
      <button
        className="w-full flex items-center justify-center gap-2 px-3 py-2 md:py-3 bg-white/20 border border-white/30 rounded-lg text-xs md:text-[12px] font-semibold text-white hover:bg-white/30 hover:border-white/50 transition-all"
        onClick={handleUploadClick}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 md:w-5 md:h-5">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload SVG
      </button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".svg"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default SvgTools