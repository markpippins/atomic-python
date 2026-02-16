import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Libraries from './pages/Libraries'
import Scanning from './pages/Scanning'
import Statistics from './pages/Statistics'

function App() {
  return (
    <ThemeProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/libraries" element={<Libraries />} />
            <Route path="/scanning" element={<Scanning />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </Layout>
      </Box>
    </ThemeProvider>
  )
}

export default App