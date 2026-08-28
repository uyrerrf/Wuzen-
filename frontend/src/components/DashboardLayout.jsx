import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import ToastContainer from './ToastContainer'

export default function DashboardLayout({ children }) {
  const { sidebarOpen, toggleSidebar } = useStore()

  return (
    <div className="flex h-screen bg-wuzen-bg overflow-hidden">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <TopBar />
        <main className="flex-1 overflow-auto p-6 relative">
          <div className="scan-line" />
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
