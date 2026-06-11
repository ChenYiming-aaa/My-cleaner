import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Pause, Play, X } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { ProgressBar } from '@/components/common/ProgressBar'
import { formatFileSize, formatDuration } from '@/utils/formatUtils'

interface ScanProgressProps {
  currentFile: string
  scannedFiles: number
  totalFiles: number
  scannedSize: number
  elapsedTime: number
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onCancel: () => void
}

export function ScanProgress({
  currentFile,
  scannedFiles,
  totalFiles,
  scannedSize,
  elapsedTime,
  isPaused,
  onPause,
  onResume,
  onCancel,
}: ScanProgressProps) {
  return (
    <Card className="border-parchment-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isPaused ? 0 : 360 }}
            transition={{ duration: 1, repeat: isPaused ? 0 : Infinity, ease: 'linear' }}
          >
            <Loader2 size={24} className="text-parchment-600" />
          </motion.div>
          <div>
            <h3 className="text-lg font-serif font-semibold text-parchment-900">
              {isPaused ? '扫描已暂停' : '正在扫描...'}
            </h3>
            <p className="text-sm text-parchment-500">
              已扫描 {scannedFiles} 个文件，{formatFileSize(scannedSize)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPaused ? onResume : onPause}
            className="p-2 bg-parchment-100 text-parchment-700 rounded-lg hover:bg-parchment-200 transition-colors"
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="p-2 bg-danger-50 text-danger-600 rounded-lg hover:bg-danger-100 transition-colors"
          >
            <X size={18} />
          </motion.button>
        </div>
      </div>
      
      <ProgressBar value={scannedFiles} max={totalFiles || 100} variant="default" size="lg" />
      
      <div className="mt-4 p-3 bg-parchment-50 rounded-lg">
        <p className="text-xs text-parchment-400 mb-1">当前扫描</p>
        <p className="text-sm font-mono text-parchment-600 truncate">{currentFile}</p>
      </div>
      
      <div className="mt-3 flex justify-between text-sm text-parchment-500">
        <span>已用时间: {formatDuration(elapsedTime)}</span>
        <span>扫描速度: {Math.round(scannedFiles / (elapsedTime / 1000))} 文件/秒</span>
      </div>
    </Card>
  )
}