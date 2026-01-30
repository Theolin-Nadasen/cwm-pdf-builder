import React from 'react'
import { FabricProvider } from './context/FabricContext'
import { DocumentProvider } from './context/DocumentContext'
import Layout from './components/Layout/Layout'

function App() {
  return (
    <DocumentProvider>
      <FabricProvider>
        <Layout />
      </FabricProvider>
    </DocumentProvider>
  )
}

export default App
