import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scan as ScanIcon } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { DriveSelector } from '@/components/scan/DriveSelector'
import { ScanProgress } from '@/components/scan/ScanProgress'
import { useScanStore } from '@/stores/scanStore'
import { useSettingsStore } from '@/stores/settingsStore'

export function ScanPage() {
  const navigate = useNavigate()
  const { isScanning, isPaused, progress, startScan, pauseScan, resumeScan, cancelScan } = useScanStore()
  const { selectedDrives, setSelectedDrives } = useSettingsStore()
  const [drives, setDrives] = useState<any[]>([])

  useEffect(() => {
    loadDrives()
    
    // 监听扫描进度
    window.electronAPI.onScanProgress((progress) => {
      useScanStore.getState().setProgress(progress)
    })
    
    window.electronAPI.onScanComplete((result) => {
      useScanStore.getState().setResult(result)
      navigate('/clean')
    })
    
    window.electronAPI.onScanError((error) => {
      useScanStore.getState().setError(error)
    })
    
    return () => {
      window.electronAPI.removeAllListeners('scan-progress')
      window.electronAPI.removeAllListeners('scan-complete')
      window.electronAPI.removeAllListeners('scan-error')
    }
  }, [navigate])

  const loadDrives = async () => {
    try {
      const response = await window.electronAPI.getDrives()
      if (response.success) {
        setDrives(response.drives)
      }
    } catch (error) {
      console.error('Failed to load drives:', error)
    }
  }

  const handleToggleDrive = (letter: string) => {
    const newDrives = selectedDrives.includes(letter)
      ? selectedDrives.filter(d => d !== letter)
      : [...selectedDrives, letter]
    setSelectedDrives(newDrives)
  }

  const handleStartScan = async () => {
    if (selectedDrives.length === 0) return
    await startScan(selectedDrives)
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-serif font-bold text-parchment-900">磁盘扫描</h1>
        <p className="text-parchment-500 mt-1">选择要扫描的驱动器，开始深度清理</p>
      </motion.div>

      {!isScanning ? (
        <>
          <DriveSelector
            drives={drives}
            selectedDrives={selectedDrives}
            onToggleDrive={handleToggleDrive}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <Button
              variant="primary"
              size="lg"
              disabled={selectedDrives.length === 0}
              onClick={handleStartScan}
              className="px-8"
            >
              <ScanIcon size={20} className="mr-2" />
              开始扫描
            </Button>
          </motion.div>
        </>
      ) : (
        <ScanProgress
          currentFile={progress?.currentFile || ''}
          scannedFiles={progress?.scannedFiles || 0}
          totalFiles={progress?.totalFiles || 0}
          scannedSize={progress?.scannedSize || 0}
          elapsedTime={progress?.elapsedTime || 0}
          isPaused={isPaused}
          onPause={pauseScan}
          onResume={resumeScan}
          onCancel={cancelScan}
        />
      )}
    </div>
  )
}