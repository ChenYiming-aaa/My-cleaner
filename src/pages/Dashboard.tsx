import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StorageOverview } from '@/components/dashboard/StorageOverview'
import { ScanStats } from '@/components/dashboard/ScanStats'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { useSettingsStore } from '@/stores/settingsStore'
import { useScanStore } from '@/stores/scanStore'
import { Drive } from '@/types'

export function Dashboard() {
  const navigate = useNavigate()
  const { quickActions } = useSettingsStore()
  const { result } = useScanStore()
  const [drives, setDrives] = useState<Drive[]>([])

  useEffect(() => {
    loadDrives()
  }, [])

  const loadDrives = async () => {
    try {
      const response = await window.electronAPI.getDrives()
      if (response.success && response.drives) {
        setDrives(response.drives)
      }
    } catch (error) {
      console.error('Failed to load drives:', error)
    }
  }

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'scan':
        navigate('/scan')
        break
      case 'large-files':
        navigate('/large-files')
        break
      case 'duplicates':
        navigate('/duplicates')
        break
      case 'registry':
        navigate('/settings')
        break
      case 'history':
        navigate('/history')
        break
      case 'drives':
        navigate('/drives')
        break
      case 'clean':
        navigate('/clean')
        break
    }
  }

  const categories = result ? [
    { name: '系统缓存', count: result.files.filter(f => f.category === 'system-cache').length, size: result.files.filter(f => f.category === 'system-cache').reduce((sum, f) => sum + f.size, 0) },
    { name: '浏览器缓存', count: result.files.filter(f => f.category === 'browser-cache').length, size: result.files.filter(f => f.category === 'browser-cache').reduce((sum, f) => sum + f.size, 0) },
    { name: '临时文件', count: result.files.filter(f => f.category === 'temp-files').length, size: result.files.filter(f => f.category === 'temp-files').reduce((sum, f) => sum + f.size, 0) },
    { name: '安装包', count: result.files.filter(f => f.category === 'installers').length, size: result.files.filter(f => f.category === 'installers').reduce((sum, f) => sum + f.size, 0) },
    { name: '日志文件', count: result.files.filter(f => f.category === 'log-files').length, size: result.files.filter(f => f.category === 'log-files').reduce((sum, f) => sum + f.size, 0) },
  ] : []

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-serif font-bold text-parchment-900">仪表盘</h1>
        <p className="text-parchment-500 mt-1">系统存储概览和快捷操作</p>
      </motion.div>

      <div className="grid grid-cols-5 gap-6">
        <StorageOverview drives={drives} />
        <QuickActions
          selectedActions={quickActions}
          onActionClick={handleActionClick}
          onCustomize={() => {}}
        />
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ScanStats categories={categories} />
        </motion.div>
      )}
    </div>
  )
}
