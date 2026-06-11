import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, User } from 'lucide-react'

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-parchment-100 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-parchment-400" />
          <input
            type="text"
            placeholder="搜索文件..."
            className="pl-10 pr-4 py-2 bg-parchment-50 border border-parchment-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-parchment-400 focus:border-transparent w-64"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-parchment-500 hover:text-parchment-700 hover:bg-parchment-50 rounded-lg transition-colors"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </motion.button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-parchment-200">
          <div className="w-9 h-9 bg-parchment-200 rounded-full flex items-center justify-center">
            <User size={18} className="text-parchment-600" />
          </div>
          <span className="text-sm font-medium text-parchment-700">用户</span>
        </div>
      </div>
    </header>
  )
}
