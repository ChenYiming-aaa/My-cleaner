import { create } from 'zustand'
import { ScanResult, ScanProgress, FileItem, CategoryStats, FileCategory } from '@/types'

interface ScanState {
  isScanning: boolean
  isPaused: boolean
  progress: ScanProgress | null
  result: ScanResult | null
  error: string | null

  selectedFiles: Set<string>
  selectedCategories: Set<FileCategory>

  startScan: (drives: string[]) => Promise<void>
  pauseScan: () => Promise<void>
  resumeScan: () => Promise<void>
  cancelScan: () => Promise<void>
  setProgress: (progress: ScanProgress) => void
  setResult: (result: ScanResult) => void
  setError: (error: string) => void
  toggleFileSelection: (fileId: string) => void
  toggleCategorySelection: (category: FileCategory) => void
  selectAllInCategory: (category: FileCategory) => void
  deselectAllInCategory: (category: FileCategory) => void
  clearSelection: () => void
  getSelectedFiles: () => FileItem[]
  getCategoryStats: () => CategoryStats[]
}

export const useScanStore = create<ScanState>((set, get) => ({
  isScanning: false,
  isPaused: false,
  progress: null,
  result: null,
  error: null,
  selectedFiles: new Set(),
  selectedCategories: new Set(),

  startScan: async (drives: string[]) => {
    set({ isScanning: true, isPaused: false, error: null, result: null })

    try {
      const result = await window.electronAPI.startScan(drives)
      if (!result.success) {
        set({ error: result.error, isScanning: false })
      }
    } catch (error) {
      set({ error: (error as Error).message, isScanning: false })
    }
  },

  pauseScan: async () => {
    try {
      await window.electronAPI.pauseScan()
      set({ isPaused: true })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  resumeScan: async () => {
    try {
      await window.electronAPI.resumeScan()
      set({ isPaused: false })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  cancelScan: async () => {
    try {
      await window.electronAPI.cancelScan()
      set({ isScanning: false, isPaused: false })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  setProgress: (progress: ScanProgress) => set({ progress }),

  setResult: (result: ScanResult) => set({
    result,
    isScanning: false,
    selectedFiles: new Set(),
    selectedCategories: new Set(),
  }),

  setError: (error: string) => set({ error, isScanning: false }),

  toggleFileSelection: (fileId: string) => {
    const { selectedFiles } = get()
    const newSelection = new Set(selectedFiles)

    if (newSelection.has(fileId)) {
      newSelection.delete(fileId)
    } else {
      newSelection.add(fileId)
    }

    set({ selectedFiles: newSelection })
  },

  toggleCategorySelection: (category: FileCategory) => {
    const { selectedCategories, result } = get()
    const newCategories = new Set(selectedCategories)

    if (newCategories.has(category)) {
      newCategories.delete(category)
    } else {
      newCategories.add(category)
    }

    const newFiles = new Set(get().selectedFiles)
    if (result) {
      result.files
        .filter(f => f.category === category)
        .forEach(f => {
          if (newCategories.has(category)) {
            newFiles.add(f.id)
          } else {
            newFiles.delete(f.id)
          }
        })
    }

    set({ selectedCategories: newCategories, selectedFiles: newFiles })
  },

  selectAllInCategory: (category: FileCategory) => {
    const { result, selectedFiles } = get()
    const newFiles = new Set(selectedFiles)

    if (result) {
      result.files
        .filter(f => f.category === category)
        .forEach(f => newFiles.add(f.id))
    }

    set({ selectedFiles: newFiles })
  },

  deselectAllInCategory: (category: FileCategory) => {
    const { result, selectedFiles } = get()
    const newFiles = new Set(selectedFiles)

    if (result) {
      result.files
        .filter(f => f.category === category)
        .forEach(f => newFiles.delete(f.id))
    }

    set({ selectedFiles: newFiles })
  },

  clearSelection: () => set({
    selectedFiles: new Set(),
    selectedCategories: new Set(),
  }),

  getSelectedFiles: () => {
    const { result, selectedFiles } = get()
    if (!result) return []
    return result.files.filter(f => selectedFiles.has(f.id))
  },

  getCategoryStats: () => {
    const { result } = get()
    if (!result) return []

    const categoryMap = new Map<FileCategory, { count: number; size: number }>()

    result.files.forEach(file => {
      const existing = categoryMap.get(file.category) || { count: 0, size: 0 }
      categoryMap.set(file.category, {
        count: existing.count + 1,
        size: existing.size + file.size,
      })
    })

    return Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      label: getCategoryLabel(category),
      count: stats.count,
      totalSize: stats.size,
      icon: getCategoryIcon(category),
      riskLevel: getCategoryRiskLevel(category),
    }))
  },
}))

function getCategoryLabel(category: FileCategory): string {
  const labels: Record<FileCategory, string> = {
    'system-cache': '系统缓存',
    'browser-cache': '浏览器缓存',
    'temp-files': '临时文件',
    'installers': '安装包',
    'log-files': '日志文件',
    'duplicate-files': '重复文件',
    'large-files': '大文件',
    'empty-folders': '空文件夹',
    'recycle-bin': '回收站',
    'other': '其他文件',
  }
  return labels[category] || category
}

function getCategoryIcon(category: FileCategory): string {
  const icons: Record<FileCategory, string> = {
    'system-cache': 'Database',
    'browser-cache': 'Globe',
    'temp-files': 'FileTemp',
    'installers': 'Package',
    'log-files': 'FileText',
    'duplicate-files': 'Copy',
    'large-files': 'HardDrive',
    'empty-folders': 'FolderOpen',
    'recycle-bin': 'Trash2',
    'other': 'File',
  }
  return icons[category] || 'File'
}

function getCategoryRiskLevel(category: FileCategory): 'safe' | 'moderate' | 'dangerous' {
  const levels: Record<FileCategory, 'safe' | 'moderate' | 'dangerous'> = {
    'system-cache': 'safe',
    'browser-cache': 'safe',
    'temp-files': 'safe',
    'installers': 'moderate',
    'log-files': 'safe',
    'duplicate-files': 'moderate',
    'large-files': 'moderate',
    'empty-folders': 'safe',
    'recycle-bin': 'safe',
    'other': 'moderate',
  }
  return levels[category] || 'moderate'
}
