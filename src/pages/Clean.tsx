import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, ArrowLeft, Recycle, Zap } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { CategoryFilter } from '@/components/clean/CategoryFilter'
import { FileList } from '@/components/clean/FileList'
import { useScanStore } from '@/stores/scanStore'
import { formatFileSize } from '@/utils/formatUtils'

export function CleanPage() {
  const navigate = useNavigate()
  const { result, selectedFiles, toggleFileSelection, toggleCategorySelection, getCategoryStats } = useScanStore()
  const [deleteMode, setDeleteMode] = useState<'recycle' | 'permanent'>('recycle')
  const [isDeleting, setIsDeleting] = useState(false)

  if (!result) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-12">
            <Trash2 size={48} className="mx-auto text-parchment-300 mb-4" />
            <h2 className="text-xl font-serif font-semibold text-parchment-700 mb-2">
              暂无扫描结果
            </h2>
            <p className="text-parchment-500 mb-6">请先进行磁盘扫描</p>
            <Button onClick={() => navigate('/scan')}>开始扫描</Button>
          </div>
        </Card>
      </div>
    )
  }

  const categoryStats = getCategoryStats()
  const categories = categoryStats.map(cat => ({
    id: cat.category as string,
    label: cat.label,
    count: cat.count,
    size: cat.totalSize,
    riskLevel: cat.riskLevel,
    selected: useScanStore.getState().selectedCategories.has(cat.category),
  }))

  const selectedFilesList = result.files.filter(f => selectedFiles.has(f.id))
  const totalSelectedSize = selectedFilesList.reduce((sum, f) => sum + f.size, 0)

  const handleClean = async () => {
    if (selectedFilesList.length === 0) return
    
    setIsDeleting(true)
    try {
      const fileIds = selectedFilesList.map(f => f.id)
      await window.electronAPI.cleanFiles(fileIds, deleteMode === 'recycle')
      navigate('/')
    } catch (error) {
      console.error('Clean failed:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <button
            onClick={() => navigate('/scan')}
            className="flex items-center gap-2 text-parchment-500 hover:text-parchment-700 mb-2"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">返回扫描</span>
          </button>
          <h1 className="text-3xl font-serif font-bold text-parchment-900">清理文件</h1>
          <p className="text-parchment-500 mt-1">
            已选择 {selectedFilesList.length} 个文件，共 {formatFileSize(totalSelectedSize)}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-parchment-100 rounded-lg p-1">
            <button
              onClick={() => setDeleteMode('recycle')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                deleteMode === 'recycle'
                  ? 'bg-white text-parchment-700 shadow-sm'
                  : 'text-parchment-500 hover:text-parchment-700'
              }`}
            >
              <Recycle size={16} className="inline mr-2" />
              回收站
            </button>
            <button
              onClick={() => setDeleteMode('permanent')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                deleteMode === 'permanent'
                  ? 'bg-white text-danger-600 shadow-sm'
                  : 'text-parchment-500 hover:text-parchment-700'
              }`}
            >
              <Zap size={16} className="inline mr-2" />
              永久删除
            </button>
          </div>
          
          <Button
            variant="danger"
            disabled={selectedFilesList.length === 0 || isDeleting}
            loading={isDeleting}
            onClick={handleClean}
          >
            <Trash2 size={18} className="mr-2" />
            清理选中文件
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1"
        >
          <Card>
            <CategoryFilter
              categories={categories}
              onToggleCategory={toggleCategorySelection}
            />
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-3"
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-semibold text-parchment-900">
                文件列表
              </h3>
              <span className="text-sm text-parchment-500">
                {result.files.length} 个文件
              </span>
            </div>
            
            <FileList
              files={result.files}
              onToggleFile={toggleFileSelection}
              onDeleteFile={(_id) => {
                // 单个文件删除逻辑
              }}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
