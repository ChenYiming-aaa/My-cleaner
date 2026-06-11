import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Dashboard } from '@/pages/Dashboard'
import { ScanPage } from '@/pages/Scan'
import { CleanPage } from '@/pages/Clean'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-parchment-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/clean" element={<CleanPage />} />
              <Route path="/settings" element={<div>设置页面开发中...</div>} />
              <Route path="/history" element={<div>历史页面开发中...</div>} />
              <Route path="/large-files" element={<div>大文件页面开发中...</div>} />
              <Route path="/duplicates" element={<div>重复文件页面开发中...</div>} />
              <Route path="/drives" element={<div>驱动器页面开发中...</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App