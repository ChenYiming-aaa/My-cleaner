import React from 'react'
import { motion } from 'framer-motion'
import { HardDrive, Check } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { formatFileSize } from '@/utils/formatUtils'

interface Drive {
  letter: string
  label: string
  totalSpace: number
  usedSpace: number
  freeSpace: number
}

interface DriveSelectorProps {
  drives: Drive[]
  selectedDrives: string[]
  onToggleDrive: (letter: string) => void
}

export function DriveSelector({ drives, selectedDrives, onToggleDrive }: DriveSelectorProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <HardDrive size={20} className="text-parchment-600" />
        <h3 className="text-lg font-serif font-semibold text-parchment-900">选择驱动器</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {drives.map((drive) => {
          const isSelected = selectedDrives.includes(drive.letter)
          const usagePercent = (drive.usedSpace / drive.totalSpace) * 100
          
          return (
            <motion.button
              key={drive.letter}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleDrive(drive.letter)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-parchment-500 bg-parchment-50'
                  : 'border-parchment-100 bg-white hover:border-parchment-200'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-parchment-500 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
              
              <div className="text-left">
                <p className="text-lg font-semibold text-parchment-900">{drive.letter}</p>
                <p className="text-sm text-parchment-500">{drive.label}</p>
                
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-parchment-500">
                    <span>已使用 {Math.round(usagePercent)}%</span>
                    <span>{formatFileSize(drive.freeSpace)} 可用</span>
                  </div>
                  <div className="w-full h-2 bg-parchment-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-parchment-500 rounded-full transition-all"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </Card>
  )
}