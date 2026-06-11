import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Scan,
  Trash2,
  Settings,
  HardDrive,
  FileSearch,
  Files,
  History,
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '仪表盘' },
  { path: '/scan', icon: Scan, label: '磁盘扫描' },
  { path: '/clean', icon: Trash2, label: '清理' },
  { path: '/drives', icon: HardDrive, label: '驱动器' },
  { path: '/large-files', icon: FileSearch, label: '大文件' },
  { path: '/duplicates', icon: Files, label: '重复文件' },
  { path: '/history', icon: History, label: '清理历史' },
  { path: '/settings', icon: Settings, label: '设置' },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-parchment-100 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-serif font-bold text-parchment-900">
          Deep Cleaner
        </h1>
        <p className="text-sm text-parchment-500 mt-1">深度清理工具</p>
      </div>
      
      <nav className="px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-parchment-100 text-parchment-900 font-medium'
                  : 'text-parchment-600 hover:bg-parchment-50 hover:text-parchment-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'text-parchment-700' : 'text-parchment-400'} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 bg-parchment-600 rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
