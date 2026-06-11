import React from 'react'
import { motion } from 'framer-motion'
import { Scan, FileSearch, Files, Settings, History, HardDrive, Trash2 } from 'lucide-react'
import { Card } from '@/components/common/Card'

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const availableActions: QuickAction[] = [
  { id: 'scan', label: '快速扫描', icon: <Scan size={24} />, color: 'text-parchment-600', bgColor: 'bg-parchment-100' },
  { id: 'large-files', label: '大文件查找', icon: <FileSearch size={24} />, color: 'text-warning-600', bgColor: 'bg-warning-50' },
  { id: 'duplicates', label: '重复文件', icon: <Files size={24} />, color: 'text-success-600', bgColor: 'bg-success-50' },
  { id: 'registry', label: '注册表清理', icon: <Settings size={24} />, color: 'text-danger-600', bgColor: 'bg-danger-50' },
  { id: 'history', label: '清理历史', icon: <History size={24} />, color: 'text-parchment-500', bgColor: 'bg-parchment-50' },
  { id: 'drives', label: '驱动器管理', icon: <HardDrive size={24} />, color: 'text-parchment-600', bgColor: 'bg-parchment-100' },
  { id: 'clean', label: '一键清理', icon: <Trash2 size={24} />, color: 'text-danger-500', bgColor: 'bg-danger-50' },
]

interface QuickActionsProps {
  selectedActions: string[]
  onActionClick: (actionId: string) => void
  onCustomize: () => void
}

export function QuickActions({ selectedActions, onActionClick, onCustomize }: QuickActionsProps) {
  const selected = availableActions.filter(a => selectedActions.includes(a.id))

  return (
    <Card className="col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-serif font-semibold text-parchment-900">快捷功能</h3>
        <button
          onClick={onCustomize}
          className="text-sm text-parchment-500 hover:text-parchment-700 transition-colors"
        >
          自定义
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {selected.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onActionClick(action.id)}
            className="flex items-center gap-3 p-4 bg-white border border-parchment-100 rounded-xl hover:shadow-md transition-all"
          >
            <div className={`p-2 rounded-lg ${action.bgColor}`}>
              <span className={action.color}>{action.icon}</span>
            </div>
            <span className="text-sm font-medium text-parchment-700">{action.label}</span>
          </motion.button>
        ))}
        
        {selected.length < 4 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCustomize}
            className="flex items-center justify-center p-4 border-2 border-dashed border-parchment-200 rounded-xl text-parchment-400 hover:text-parchment-600 hover:border-parchment-300 transition-all"
          >
            + 添加快捷功能
          </motion.button>
        )}
      </div>
    </Card>
  )
}
