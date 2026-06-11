export interface Drive {
  letter: string
  label: string
  totalSpace: number
  usedSpace: number
  freeSpace: number
  fileSystem: string
}

export interface ScanProgress {
  currentFile: string
  scannedFiles: number
  totalFiles: number
  scannedSize: number
  elapsedTime: number
  estimatedTime: number
  phase: 'scanning' | 'analyzing' | 'complete'
}

export interface FileItem {
  id: string
  path: string
  name: string
  size: number
  type: FileType
  category: FileCategory
  lastModified: Date
  riskLevel: 'safe' | 'moderate' | 'dangerous'
  selected: boolean
  deletable: boolean
}

export type FileType = 
  | 'cache'
  | 'temp'
  | 'installer'
  | 'log'
  | 'duplicate'
  | 'large'
  | 'empty-folder'
  | 'recycle'
  | 'other'

export type FileCategory = 
  | 'system-cache'
  | 'browser-cache'
  | 'temp-files'
  | 'installers'
  | 'log-files'
  | 'duplicate-files'
  | 'large-files'
  | 'empty-folders'
  | 'recycle-bin'
  | 'other'

export interface CategoryStats {
  category: FileCategory
  label: string
  count: number
  totalSize: number
  icon: string
  riskLevel: 'safe' | 'moderate' | 'dangerous'
}

export interface ScanResult {
  id: string
  timestamp: Date
  drives: string[]
  totalFiles: number
  totalSize: number
  categories: CategoryStats[]
  files: FileItem[]
  duration: number
}

export interface CleanHistory {
  id: string
  timestamp: Date
  filesCleaned: number
  spaceFreed: number
  categories: FileCategory[]
}

export interface QuickAction {
  id: string
  label: string
  icon: string
  action: () => void
  enabled: boolean
}