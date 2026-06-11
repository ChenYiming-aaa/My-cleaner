# 深度清理工具 MVP 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个功能完整的Windows系统清理工具MVP版本，包含仪表盘首页、磁盘扫描、文件分类和基本清理功能。

**Architecture:** 使用Electron + React + TypeScript构建桌面应用，主进程负责文件系统操作和系统API调用，渲染进程负责UI展示和用户交互。采用Zustand进行状态管理，Tailwind CSS进行样式设计，Framer Motion实现动画效果。

**Tech Stack:** Electron 28, React 18, TypeScript 5, Vite 5, Tailwind CSS 3, Framer Motion 10, Recharts 2, Zustand 4

---

## 项目结构

```
deep-cleaner/
├── electron/
│   ├── main.ts                    # Electron主进程入口
│   ├── preload.ts                 # 预加载脚本
│   └── ipc/
│       ├── scanHandlers.ts        # 扫描相关IPC处理
│       └── cleanHandlers.ts       # 清理相关IPC处理
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # 侧边栏导航
│   │   │   └── Header.tsx         # 顶部导航
│   │   ├── dashboard/
│   │   │   ├── StorageOverview.tsx # 存储概览
│   │   │   ├── ScanStats.tsx      # 扫描统计
│   │   │   └── QuickActions.tsx   # 快捷功能
│   │   ├── scan/
│   │   │   ├── ScanProgress.tsx   # 扫描进度
│   │   │   └── FileList.tsx       # 文件列表
│   │   └── common/
│   │       ├── Button.tsx         # 按钮组件
│   │       ├── Card.tsx           # 卡片组件
│   │       └── Modal.tsx          # 模态框
│   ├── pages/
│   │   ├── Dashboard.tsx          # 仪表盘页面
│   │   ├── Scan.tsx               # 扫描页面
│   │   ├── Clean.tsx              # 清理页面
│   │   └── Settings.tsx           # 设置页面
│   ├── stores/
│   │   ├── scanStore.ts           # 扫描状态管理
│   │   ├── cleanStore.ts          # 清理状态管理
│   │   └── settingsStore.ts       # 设置状态管理
│   ├── services/
│   │   ├── scanner.ts             # 扫描服务
│   │   └── cleaner.ts             # 清理服务
│   ├── types/
│   │   └── index.ts               # 类型定义
│   ├── utils/
│   │   ├── fileUtils.ts           # 文件工具函数
│   │   └── formatUtils.ts         # 格式化工具
│   ├── App.tsx                    # 主应用组件
│   ├── main.tsx                   # React入口
│   └── index.css                  # 全局样式
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── electron-builder.yml
└── .gitignore
```

---

## Task 1: 项目初始化和环境搭建

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `.gitignore`
- Create: `electron-builder.yml`

- [ ] **Step 1: 创建package.json**

```json
{
  "name": "deep-cleaner",
  "version": "1.0.0",
  "description": "深度清理工具 - Windows系统清理优化",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && electron-builder",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.7",
    "framer-motion": "^10.16.5",
    "recharts": "^2.10.3",
    "lucide-react": "^0.292.0",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@types/node": "^20.10.0",
    "@types/lodash": "^4.14.202",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.0",
    "vite-plugin-electron": "^0.28.0",
    "vite-plugin-electron-renderer": "^0.14.5"
  }
}
```

- [ ] **Step 2: 创建tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: 创建tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "electron/**/*.ts"]
}
```

- [ ] **Step 4: 创建vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
          },
        },
      },
      {
        entry: 'electron/preload.ts',
        onstart(args) {
          args.reload()
        },
        vite: {
          build: {
            outDir: 'dist-electron',
          },
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 5: 创建tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#E8DFD0',
          300: '#D4C5A9',
          400: '#C4A35A',
          500: '#B8944F',
          600: '#A67C4A',
          700: '#8B6538',
          800: '#6B4E2D',
          900: '#3D2B1F',
        },
        success: {
          50: '#F0F9F4',
          100: '#D4EDDA',
          200: '#A8D5B8',
          300: '#7CBD96',
          400: '#4A7C59',
          500: '#3D6B4A',
          600: '#2D5A3A',
          700: '#1E492A',
          800: '#0F381A',
          900: '#00270A',
        },
        warning: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE699',
          300: '#FFD966',
          400: '#D4A017',
          500: '#B8860B',
          600: '#9A7209',
          700: '#7C5E07',
          800: '#5E4A05',
          900: '#403603',
        },
        danger: {
          50: '#FDF2EC',
          100: '#F8D9C4',
          200: '#F0B899',
          300: '#E8976E',
          400: '#8B4513',
          500: '#7A3B10',
          600: '#69310D',
          700: '#58270A',
          800: '#471D07',
          900: '#361304',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        sans: ['Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 6: 创建postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: 创建.gitignore**

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
dist-electron
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Electron
release
*.exe
*.msi
*.dmg

# Environment
.env
.env.local
.env.*.local
```

- [ ] **Step 8: 创建electron-builder.yml**

```yaml
appId: com.deepcleaner.app
productName: Deep Cleaner
directories:
  release: release
files:
  - dist
  - dist-electron
win:
  target:
    - nsis
  icon: public/icon.ico
nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true
mac:
  target:
    - dmg
  icon: public/icon.icns
linux:
  target:
    - AppImage
  icon: public/icon.png
```

- [ ] **Step 9: 提交初始项目结构**

```bash
git add .
git commit -m "chore: initialize project structure with Electron + React + TypeScript"
```

---

## Task 2: Electron主进程和预加载脚本

**Files:**
- Create: `electron/main.ts`
- Create: `electron/preload.ts`
- Create: `electron/ipc/scanHandlers.ts`

- [ ] **Step 1: 创建electron/main.ts**

```typescript
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { scanHandlers } from './ipc/scanHandlers'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, '../public/icon.ico'),
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()
  scanHandlers()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('get-app-path', () => {
  return app.getAppPath()
})
```

- [ ] **Step 2: 创建electron/preload.ts**

```typescript
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // 扫描相关
  startScan: (drives: string[]) => ipcRenderer.invoke('start-scan', drives),
  pauseScan: () => ipcRenderer.invoke('pause-scan'),
  resumeScan: () => ipcRenderer.invoke('resume-scan'),
  cancelScan: () => ipcRenderer.invoke('cancel-scan'),
  getScanProgress: () => ipcRenderer.invoke('get-scan-progress'),
  
  // 清理相关
  cleanFiles: (fileIds: string[], useRecycleBin: boolean) => 
    ipcRenderer.invoke('clean-files', fileIds, useRecycleBin),
  getCleanHistory: () => ipcRenderer.invoke('get-clean-history'),
  
  // 系统信息
  getDrives: () => ipcRenderer.invoke('get-drives'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // 事件监听
  onScanProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on('scan-progress', (_event, progress) => callback(progress))
  },
  onScanComplete: (callback: (result: any) => void) => {
    ipcRenderer.on('scan-complete', (_event, result) => callback(result))
  },
  onScanError: (callback: (error: string) => void) => {
    ipcRenderer.on('scan-error', (_event, error) => callback(error))
  },
  
  // 移除监听器
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  },
})
```

- [ ] **Step 3: 创建类型定义 src/types/index.ts**

```typescript
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
```

- [ ] **Step 4: 创建electron/ipc/scanHandlers.ts**

```typescript
import { ipcMain, BrowserWindow } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const execAsync = promisify(exec)

let scanInProgress = false
let scanPaused = false
let scanCancelled = false

export function scanHandlers() {
  // 获取磁盘驱动器
  ipcMain.handle('get-drives', async () => {
    try {
      const { stdout } = await execAsync('wmic logicaldisk get caption,label,freespace,size,filesystem')
      const lines = stdout.trim().split('\n').slice(1)
      
      const drives = lines
        .filter(line => line.trim())
        .map(line => {
          const parts = line.trim().split(/\s{2,}/)
          if (parts.length >= 5) {
            return {
              letter: parts[0],
              label: parts[1] || 'Local Disk',
              freeSpace: parseInt(parts[2]) || 0,
              totalSpace: parseInt(parts[3]) || 0,
              fileSystem: parts[4] || 'NTFS',
              usedSpace: (parseInt(parts[3]) || 0) - (parseInt(parts[2]) || 0),
            }
          }
          return null
        })
        .filter(Boolean)
      
      return { success: true, drives }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // 开始扫描
  ipcMain.handle('start-scan', async (_event, drives: string[]) => {
    if (scanInProgress) {
      return { success: false, error: 'Scan already in progress' }
    }

    scanInProgress = true
    scanPaused = false
    scanCancelled = false

    const mainWindow = BrowserWindow.getAllWindows()[0]
    
    try {
      // 异步执行扫描
      performScan(drives, mainWindow)
      return { success: true }
    } catch (error) {
      scanInProgress = false
      return { success: false, error: (error as Error).message }
    }
  })

  // 暂停扫描
  ipcMain.handle('pause-scan', async () => {
    scanPaused = true
    return { success: true }
  })

  // 继续扫描
  ipcMain.handle('resume-scan', async () => {
    scanPaused = false
    return { success: true }
  })

  // 取消扫描
  ipcMain.handle('cancel-scan', async () => {
    scanCancelled = true
    return { success: true }
  })

  // 获取扫描进度
  ipcMain.handle('get-scan-progress', async () => {
    return { inProgress: scanInProgress, paused: scanPaused }
  })
}

async function performScan(drives: string[], mainWindow: BrowserWindow | null) {
  const startTime = Date.now()
  let scannedFiles = 0
  let totalSize = 0
  const files: any[] = []

  try {
    for (const drive of drives) {
      if (scanCancelled) break
      
      await scanDirectory(`${drive}\\`, mainWindow, startTime, files, 
        (count, size) => {
          scannedFiles = count
          totalSize = size
        }
      )
    }

    if (!scanCancelled && mainWindow) {
      mainWindow.webContents.send('scan-complete', {
        files,
        totalFiles: scannedFiles,
        totalSize,
        duration: Date.now() - startTime,
      })
    }
  } catch (error) {
    if (mainWindow) {
      mainWindow.webContents.send('scan-error', (error as Error).message)
    }
  } finally {
    scanInProgress = false
  }
}

async function scanDirectory(
  dirPath: string,
  mainWindow: BrowserWindow | null,
  startTime: number,
  files: any[],
  updateStats: (count: number, size: number) => void
) {
  if (scanCancelled || scanPaused) return

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      if (scanCancelled) break
      while (scanPaused) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const fullPath = path.join(dirPath, entry.name)
      
      try {
        if (entry.isDirectory()) {
          // 跳过系统目录和隐藏目录
          if (!entry.name.startsWith('.') && 
              !['$Recycle.Bin', 'System Volume Information', 'Windows'].includes(entry.name)) {
            await scanDirectory(fullPath, mainWindow, startTime, files, updateStats)
          }
        } else {
          const stat = await fs.stat(fullPath)
          const fileItem = {
            id: uuidv4(),
            path: fullPath,
            name: entry.name,
            size: stat.size,
            lastModified: stat.mtime,
            category: categorizeFile(entry.name, fullPath),
            riskLevel: assessRisk(entry.name, fullPath),
          }
          
          files.push(fileItem)
          updateStats(files.length, files.reduce((sum, f) => sum + f.size, 0))
          
          // 发送进度更新
          if (mainWindow && files.length % 100 === 0) {
            mainWindow.webContents.send('scan-progress', {
              currentFile: fullPath,
              scannedFiles: files.length,
              elapsedTime: Date.now() - startTime,
            })
          }
        }
      } catch (error) {
        // 跳过无法访问的文件
        continue
      }
    }
  } catch (error) {
    // 跳过无法访问的目录
  }
}

function categorizeFile(fileName: string, filePath: string): string {
  const ext = path.extname(fileName).toLowerCase()
  const lowerName = fileName.toLowerCase()
  const lowerPath = filePath.toLowerCase()

  // 缓存文件
  if (lowerPath.includes('cache') || lowerPath.includes('temp') || 
      lowerPath.includes('tmp') || ext === '.tmp' || ext === '.cache') {
    return 'cache'
  }

  // 临时文件
  if (ext === '.temp' || ext === '.bak' || ext === '.old' || 
      lowerName.startsWith('~') || lowerName.endsWith('.dmp')) {
    return 'temp'
  }

  // 安装包
  if (['.exe', '.msi', '.msix', '.appx'].includes(ext) && 
      (lowerName.includes('setup') || lowerName.includes('install'))) {
    return 'installer'
  }

  // 日志文件
  if (ext === '.log' || ext === '.etl' || ext === '.evtx') {
    return 'log'
  }

  return 'other'
}

function assessRisk(fileName: string, filePath: string): 'safe' | 'moderate' | 'dangerous' {
  const ext = path.extname(fileName).toLowerCase()
  const lowerPath = filePath.toLowerCase()

  // 系统关键文件
  if (lowerPath.includes('\\windows\\system32') || 
      lowerPath.includes('\\windows\\syswow64')) {
    return 'dangerous'
  }

  // 缓存和临时文件通常是安全的
  if (lowerPath.includes('cache') || lowerPath.includes('temp') || 
      ext === '.tmp' || ext === '.log') {
    return 'safe'
  }

  // 安装包需要用户确认
  if (['.exe', '.msi'].includes(ext)) {
    return 'moderate'
  }

  return 'safe'
}
```

- [ ] **Step 5: 提交Electron主进程**

```bash
git add electron/ src/types/
git commit -m "feat: add Electron main process and preload script with IPC handlers"
```

---

## Task 3: Zustand状态管理

**Files:**
- Create: `src/stores/scanStore.ts`
- Create: `src/stores/settingsStore.ts`

- [ ] **Step 1: 创建src/stores/scanStore.ts**

```typescript
import { create } from 'zustand'
import { ScanResult, ScanProgress, FileItem, CategoryStats } from '@/types'

interface ScanState {
  // 扫描状态
  isScanning: boolean
  isPaused: boolean
  progress: ScanProgress | null
  result: ScanResult | null
  error: string | null
  
  // 文件选择
  selectedFiles: Set<string>
  selectedCategories: Set<string>
  
  // Actions
  startScan: (drives: string[]) => Promise<void>
  pauseScan: () => Promise<void>
  resumeScan: () => Promise<void>
  cancelScan: () => Promise<void>
  setProgress: (progress: ScanProgress) => void
  setResult: (result: ScanResult) => void
  setError: (error: string) => void
  toggleFileSelection: (fileId: string) => void
  toggleCategorySelection: (category: string) => void
  selectAllInCategory: (category: string) => void
  deselectAllInCategory: (category: string) => void
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

  toggleCategorySelection: (category: string) => {
    const { selectedCategories, result } = get()
    const newCategories = new Set(selectedCategories)
    
    if (newCategories.has(category)) {
      newCategories.delete(category)
    } else {
      newCategories.add(category)
    }
    
    // 更新该类别下所有文件的选择状态
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

  selectAllInCategory: (category: string) => {
    const { result, selectedFiles } = get()
    const newFiles = new Set(selectedFiles)
    
    if (result) {
      result.files
        .filter(f => f.category === category)
        .forEach(f => newFiles.add(f.id))
    }
    
    set({ selectedFiles: newFiles })
  },

  deselectAllInCategory: (category: string) => {
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
    selectedCategories: new Set() 
  }),

  getSelectedFiles: () => {
    const { result, selectedFiles } = get()
    if (!result) return []
    return result.files.filter(f => selectedFiles.has(f.id))
  },

  getCategoryStats: () => {
    const { result } = get()
    if (!result) return []
    
    const categoryMap = new Map<string, { count: number; size: number }>()
    
    result.files.forEach(file => {
      const existing = categoryMap.get(file.category) || { count: 0, size: 0 }
      categoryMap.set(file.category, {
        count: existing.count + 1,
        size: existing.size + file.size,
      })
    })
    
    return Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category: category as any,
      label: getCategoryLabel(category),
      count: stats.count,
      totalSize: stats.size,
      icon: getCategoryIcon(category),
      riskLevel: getCategoryRiskLevel(category),
    }))
  },
}))

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'cache': '缓存文件',
    'temp': '临时文件',
    'installer': '安装包',
    'log': '日志文件',
    'other': '其他文件',
  }
  return labels[category] || category
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'cache': 'Database',
    'temp': 'FileTemp',
    'installer': 'Package',
    'log': 'FileText',
    'other': 'File',
  }
  return icons[category] || 'File'
}

function getCategoryRiskLevel(category: string): 'safe' | 'moderate' | 'dangerous' {
  const levels: Record<string, 'safe' | 'moderate' | 'dangerous'> = {
    'cache': 'safe',
    'temp': 'safe',
    'installer': 'moderate',
    'log': 'safe',
    'other': 'moderate',
  }
  return levels[category] || 'moderate'
}
```

- [ ] **Step 2: 创建src/stores/settingsStore.ts**

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  // 扫描设置
  selectedDrives: string[]
  scanDepth: 'quick' | 'deep' | 'custom'
  autoSelectSafe: boolean
  
  // 清理设置
  useRecycleBin: boolean
  confirmBeforeClean: boolean
  
  // 界面设置
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  
  // 快捷功能
  quickActions: string[]
  
  // Actions
  setSelectedDrives: (drives: string[]) => void
  setScanDepth: (depth: 'quick' | 'deep' | 'custom') => void
  setAutoSelectSafe: (auto: boolean) => void
  setUseRecycleBin: (use: boolean) => void
  setConfirmBeforeClean: (confirm: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (lang: 'zh-CN' | 'en-US') => void
  setQuickActions: (actions: string[]) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      selectedDrives: ['C:'],
      scanDepth: 'deep',
      autoSelectSafe: true,
      useRecycleBin: true,
      confirmBeforeClean: true,
      theme: 'light',
      language: 'zh-CN',
      quickActions: ['scan', 'large-files', 'duplicates', 'registry'],

      setSelectedDrives: (drives: string[]) => set({ selectedDrives: drives }),
      setScanDepth: (depth) => set({ scanDepth: depth }),
      setAutoSelectSafe: (auto) => set({ autoSelectSafe: auto }),
      setUseRecycleBin: (use) => set({ useRecycleBin: use }),
      setConfirmBeforeClean: (confirm) => set({ confirmBeforeClean: confirm }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (lang) => set({ language: lang }),
      setQuickActions: (actions) => set({ quickActions: actions }),
    }),
    {
      name: 'deep-cleaner-settings',
    }
  )
)
```

- [ ] **Step 3: 提交状态管理**

```bash
git add src/stores/
git commit -m "feat: add Zustand stores for scan and settings state management"
```

---

## Task 4: 工具函数

**Files:**
- Create: `src/utils/formatUtils.ts`
- Create: `src/utils/fileUtils.ts`

- [ ] **Step 1: 创建src/utils/formatUtils.ts**

```typescript
/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化时间（毫秒）
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%'
  return `${((value / total) * 100).toFixed(1)}%`
}
```

- [ ] **Step 2: 创建src/utils/fileUtils.ts**

```typescript
import path from 'path'

/**
 * 获取文件扩展名
 */
export function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase()
}

/**
 * 获取文件名（不含扩展名）
 */
export function getFileNameWithoutExtension(filePath: string): string {
  const name = path.basename(filePath)
  return name.substring(0, name.lastIndexOf('.')) || name
}

/**
 * 判断是否为可执行文件
 */
export function isExecutable(filePath: string): boolean {
  const ext = getFileExtension(filePath)
  return ['.exe', '.msi', '.bat', '.cmd', '.ps1'].includes(ext)
}

/**
 * 判断是否为安装包
 */
export function isInstaller(filePath: string): boolean {
  const ext = getFileExtension(filePath)
  const name = path.basename(filePath).toLowerCase()
  
  return (
    ['.exe', '.msi', '.msix', '.appx'].includes(ext) &&
    (name.includes('setup') || name.includes('install') || name.includes('update'))
  )
}

/**
 * 判断是否为临时文件
 */
export function isTempFile(filePath: string): boolean {
  const ext = getFileExtension(filePath)
  const name = path.basename(filePath).toLowerCase()
  
  return (
    ['.tmp', '.temp', '.bak', '.old', '.dmp'].includes(ext) ||
    name.startsWith('~') ||
    filePath.toLowerCase().includes('\\temp\\') ||
    filePath.toLowerCase().includes('\\tmp\\')
  )
}

/**
 * 判断是否为缓存文件
 */
export function isCacheFile(filePath: string): boolean {
  const lowerPath = filePath.toLowerCase()
  return (
    lowerPath.includes('\\cache\\') ||
    lowerPath.includes('\\cached\\') ||
    lowerPath.includes('\\cookies\\') ||
    lowerPath.includes('\\history\\')
  )
}

/**
 * 判断是否为日志文件
 */
export function isLogFile(filePath: string): boolean {
  const ext = getFileExtension(filePath)
  return ['.log', '.etl', '.evtx', '.txt'].includes(ext)
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
```

- [ ] **Step 3: 提交工具函数**

```bash
git add src/utils/
git commit -m "feat: add utility functions for file and format operations"
```

---

## Task 5: 通用UI组件

**Files:**
- Create: `src/components/common/Button.tsx`
- Create: `src/components/common/Card.tsx`
- Create: `src/components/common/Modal.tsx`
- Create: `src/components/common/ProgressBar.tsx`

- [ ] **Step 1: 创建src/components/common/Button.tsx**

```tsx
import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-parchment-600 text-white hover:bg-parchment-700 focus:ring-parchment-500 disabled:bg-parchment-300',
    secondary: 'bg-parchment-100 text-parchment-800 hover:bg-parchment-200 focus:ring-parchment-400 disabled:bg-parchment-50',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-400 disabled:bg-danger-200',
    ghost: 'bg-transparent text-parchment-700 hover:bg-parchment-50 focus:ring-parchment-400 disabled:text-parchment-300',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </motion.button>
  )
}
```

- [ ] **Step 2: 创建src/components/common/Card.tsx**

```tsx
import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-parchment-100 p-6'
  const hoverStyles = hoverable ? 'hover:shadow-md hover:border-parchment-200 cursor-pointer' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 3: 创建src/components/common/Modal.tsx**

```tsx
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full ${sizes[size]} bg-parchment-50 rounded-2xl shadow-xl`}
          >
            <div className="flex items-center justify-between p-6 border-b border-parchment-200">
              <h2 className="text-xl font-serif font-semibold text-parchment-900">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-parchment-400 hover:text-parchment-600 hover:bg-parchment-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: 创建src/components/common/ProgressBar.tsx**

```tsx
import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const variants = {
    default: 'bg-parchment-500',
    success: 'bg-success-400',
    warning: 'bg-warning-400',
    danger: 'bg-danger-400',
  }
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm text-parchment-600">
          <span>{Math.round(percentage)}%</span>
          <span>{value} / {max}</span>
        </div>
      )}
      <div className={`w-full ${sizes[size]} bg-parchment-100 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${variants[variant]} rounded-full`}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 提交UI组件**

```bash
git add src/components/common/
git commit -m "feat: add common UI components (Button, Card, Modal, ProgressBar)"
```

---

## Task 6: 布局组件

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Header.tsx`

- [ ] **Step 1: 创建src/components/layout/Sidebar.tsx**

```tsx
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
```

- [ ] **Step 2: 创建src/components/layout/Header.tsx**

```tsx
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
```

- [ ] **Step 3: 提交布局组件**

```bash
git add src/components/layout/
git commit -m "feat: add layout components with sidebar navigation and header"
```

---

## Task 7: 仪表盘页面

**Files:**
- Create: `src/pages/Dashboard.tsx`
- Create: `src/components/dashboard/StorageOverview.tsx`
- Create: `src/components/dashboard/ScanStats.tsx`
- Create: `src/components/dashboard/QuickActions.tsx`

- [ ] **Step 1: 创建src/components/dashboard/StorageOverview.tsx**

```tsx
import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { HardDrive } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { formatFileSize } from '@/utils/formatUtils'

interface DriveData {
  letter: string
  label: string
  totalSpace: number
  usedSpace: number
  freeSpace: number
}

interface StorageOverviewProps {
  drives: DriveData[]
}

const COLORS = ['#C4A35A', '#4A7C59', '#D4A017', '#8B4513', '#6B4E2D']

export function StorageOverview({ drives }: StorageOverviewProps) {
  const totalSpace = drives.reduce((sum, d) => sum + d.totalSpace, 0)
  const totalUsed = drives.reduce((sum, d) => sum + d.usedSpace, 0)
  const totalFree = drives.reduce((sum, d) => sum + d.freeSpace, 0)

  const chartData = drives.map(d => ({
    name: `${d.letter} (${d.label})`,
    value: d.usedSpace,
  }))

  return (
    <Card className="col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <HardDrive size={20} className="text-parchment-600" />
        <h3 className="text-lg font-serif font-semibold text-parchment-900">存储概览</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatFileSize(value)}
                contentStyle={{
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #E8DFD0',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-parchment-50 rounded-lg">
            <p className="text-sm text-parchment-500">总容量</p>
            <p className="text-2xl font-serif font-bold text-parchment-900">
              {formatFileSize(totalSpace)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-success-50 rounded-lg">
              <p className="text-xs text-success-600">已使用</p>
              <p className="text-lg font-semibold text-success-700">
                {formatFileSize(totalUsed)}
              </p>
            </div>
            <div className="p-3 bg-parchment-50 rounded-lg">
              <p className="text-xs text-parchment-500">可用</p>
              <p className="text-lg font-semibold text-parchment-700">
                {formatFileSize(totalFree)}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            {drives.map((drive, index) => (
              <div key={drive.letter} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-parchment-600">
                  {drive.letter} ({drive.label})
                </span>
                <span className="ml-auto text-sm font-medium text-parchment-700">
                  {formatFileSize(drive.freeSpace)} 可用
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
```

- [ ] **Step 2: 创建src/components/dashboard/ScanStats.tsx**

```tsx
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { FileSearch } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { formatFileSize } from '@/utils/formatUtils'

interface CategoryData {
  name: string
  count: number
  size: number
}

interface ScanStatsProps {
  categories: CategoryData[]
}

export function ScanStats({ categories }: ScanStatsProps) {
  const chartData = categories
    .sort((a, b) => b.size - a.size)
    .slice(0, 6)
    .map(c => ({
      name: c.name,
      size: c.size,
      count: c.count,
    }))

  return (
    <Card className="col-span-3">
      <div className="flex items-center gap-2 mb-4">
        <FileSearch size={20} className="text-parchment-600" />
        <h3 className="text-lg font-serif font-semibold text-parchment-900">文件分类统计</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" tickFormatter={(value) => formatFileSize(value)} />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip
              formatter={(value: number) => formatFileSize(value)}
              contentStyle={{
                backgroundColor: '#FAF8F5',
                border: '1px solid #E8DFD0',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="size" fill="#C4A35A" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mt-4">
        {categories.slice(0, 3).map((cat) => (
          <div key={cat.name} className="p-3 bg-parchment-50 rounded-lg">
            <p className="text-xs text-parchment-500">{cat.name}</p>
            <p className="text-lg font-semibold text-parchment-700">{cat.count} 个文件</p>
            <p className="text-sm text-parchment-600">{formatFileSize(cat.size)}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
```

- [ ] **Step 3: 创建src/components/dashboard/QuickActions.tsx**

```tsx
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
```

- [ ] **Step 4: 创建src/pages/Dashboard.tsx**

```tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StorageOverview } from '@/components/dashboard/StorageOverview'
import { ScanStats } from '@/components/dashboard/ScanStats'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { useSettingsStore } from '@/stores/settingsStore'
import { useScanStore } from '@/stores/scanStore'

export function Dashboard() {
  const navigate = useNavigate()
  const { quickActions, setQuickActions } = useSettingsStore()
  const { result } = useScanStore()
  const [drives, setDrives] = useState<any[]>([])
  const [showCustomize, setShowCustomize] = useState(false)

  useEffect(() => {
    loadDrives()
  }, [])

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
    { name: '缓存文件', count: result.files.filter(f => f.category === 'cache').length, size: result.files.filter(f => f.category === 'cache').reduce((sum, f) => sum + f.size, 0) },
    { name: '临时文件', count: result.files.filter(f => f.category === 'temp').length, size: result.files.filter(f => f.category === 'temp').reduce((sum, f) => sum + f.size, 0) },
    { name: '安装包', count: result.files.filter(f => f.category === 'installer').length, size: result.files.filter(f => f.category === 'installer').reduce((sum, f) => sum + f.size, 0) },
    { name: '日志文件', count: result.files.filter(f => f.category === 'log').length, size: result.files.filter(f => f.category === 'log').reduce((sum, f) => sum + f.size, 0) },
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
          onCustomize={() => setShowCustomize(true)}
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
```

- [ ] **Step 5: 提交仪表盘页面**

```bash
git add src/pages/Dashboard.tsx src/components/dashboard/
git commit -m "feat: add dashboard page with storage overview, scan stats, and quick actions"
```

---

## Task 8: 扫描页面

**Files:**
- Create: `src/pages/Scan.tsx`
- Create: `src/components/scan/ScanProgress.tsx`
- Create: `src/components/scan/DriveSelector.tsx`

- [ ] **Step 1: 创建src/components/scan/DriveSelector.tsx**

```tsx
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
```

- [ ] **Step 2: 创建src/components/scan/ScanProgress.tsx**

```tsx
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
```

- [ ] **Step 3: 创建src/pages/Scan.tsx**

```tsx
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
```

- [ ] **Step 4: 提交扫描页面**

```bash
git add src/pages/Scan.tsx src/components/scan/
git commit -m "feat: add scan page with drive selector and scan progress components"
```

---

## Task 9: 清理页面

**Files:**
- Create: `src/pages/Clean.tsx`
- Create: `src/components/clean/FileList.tsx`
- Create: `src/components/clean/CategoryFilter.tsx`

- [ ] **Step 1: 创建src/components/clean/CategoryFilter.tsx**

```tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Check, AlertTriangle, Shield } from 'lucide-react'

interface Category {
  id: string
  label: string
  count: number
  size: number
  riskLevel: 'safe' | 'moderate' | 'dangerous'
  selected: boolean
}

interface CategoryFilterProps {
  categories: Category[]
  onToggleCategory: (categoryId: string) => void
}

const riskIcons = {
  safe: <Shield size={16} className="text-success-500" />,
  moderate: <AlertTriangle size={16} className="text-warning-500" />,
  dangerous: <AlertTriangle size={16} className="text-danger-500" />,
}

const riskColors = {
  safe: 'bg-success-50 border-success-200',
  moderate: 'bg-warning-50 border-warning-200',
  dangerous: 'bg-danger-50 border-danger-200',
}

export function CategoryFilter({ categories, onToggleCategory }: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-parchment-700 mb-3">文件分类</h3>
      
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onToggleCategory(category.id)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
            category.selected
              ? 'border-parchment-400 bg-parchment-50'
              : 'border-parchment-100 bg-white hover:border-parchment-200'
          }`}
        >
          <div className={`w-5 h-5 rounded flex items-center justify-center ${
            category.selected
              ? 'bg-parchment-500 text-white'
              : 'bg-parchment-100 text-transparent'
          }`}>
            {category.selected && <Check size={14} />}
          </div>
          
          <div className={`p-1.5 rounded ${riskColors[category.riskLevel]}`}>
            {riskIcons[category.riskLevel]}
          </div>
          
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-parchment-800">{category.label}</p>
            <p className="text-xs text-parchment-500">
              {category.count} 个文件
            </p>
          </div>
          
          <span className="text-sm font-medium text-parchment-600">
            {formatSize(category.size)}
          </span>
        </motion.button>
      ))}
    </div>
  )
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
```

- [ ] **Step 2: 创建src/components/clean/FileList.tsx**

```tsx
import React from 'react'
import { motion } from 'framer-motion'
import { File, Trash2, ExternalLink } from 'lucide-react'

interface FileItem {
  id: string
  path: string
  name: string
  size: number
  category: string
  riskLevel: 'safe' | 'moderate' | 'dangerous'
  selected: boolean
}

interface FileListProps {
  files: FileItem[]
  onToggleFile: (fileId: string) => void
  onDeleteFile: (fileId: string) => void
}

const riskColors = {
  safe: 'text-success-600',
  moderate: 'text-warning-600',
  dangerous: 'text-danger-600',
}

export function FileList({ files, onToggleFile, onDeleteFile }: FileListProps) {
  return (
    <div className="space-y-1">
      {files.map((file, index) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02 }}
          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
            file.selected
              ? 'bg-parchment-50 border border-parchment-200'
              : 'bg-white hover:bg-parchment-50'
          }`}
        >
          <input
            type="checkbox"
            checked={file.selected}
            onChange={() => onToggleFile(file.id)}
            className="w-4 h-4 text-parchment-500 rounded focus:ring-parchment-400"
          />
          
          <div className="p-2 bg-parchment-50 rounded">
            <File size={16} className="text-parchment-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-parchment-800 truncate">{file.name}</p>
            <p className="text-xs text-parchment-400 truncate">{file.path}</p>
          </div>
          
          <span className={`text-xs font-medium ${riskColors[file.riskLevel]}`}>
            {file.riskLevel === 'safe' ? '安全' : file.riskLevel === 'moderate' ? '中等' : '危险'}
          </span>
          
          <span className="text-sm text-parchment-600 w-20 text-right">
            {formatSize(file.size)}
          </span>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDeleteFile(file.id)}
              className="p-1.5 text-parchment-400 hover:text-danger-500 hover:bg-danger-50 rounded transition-colors"
            >
              <Trash2 size={14} />
            </button>
            <button className="p-1.5 text-parchment-400 hover:text-parchment-600 hover:bg-parchment-100 rounded transition-colors">
              <ExternalLink size={14} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
```

- [ ] **Step 3: 创建src/pages/Clean.tsx**

```tsx
import React, { useState } from 'react'
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
    id: cat.category,
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
      // 清理完成后跳转到结果页面
      navigate('/clean-result')
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
              onDeleteFile={(id) => {
                // 单个文件删除逻辑
              }}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 提交清理页面**

```bash
git add src/pages/Clean.tsx src/components/clean/
git commit -m "feat: add clean page with category filter and file list components"
```

---

## Task 10: 主应用和路由

**Files:**
- Create: `src/App.tsx`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Create: `index.html`

- [ ] **Step 1: 创建src/App.tsx**

```tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Dashboard } from '@/pages/Dashboard'
import { ScanPage } from '@/pages/Scan'
import { CleanPage } from '@/pages/Clean'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-parchment-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/clean" element={<CleanPage />} />
              <Route path="/settings" element={<div>设置页面开发中...</div>} />
              <Route path="/history" element={<div>历史页面开发中...</div>} />
              <Route path="/large-files" element={<div>大文件页面开发中...</div>} />
              <Route path="/duplicates" element={<div>重复文件页面开发中...</div>} />
              <Route path="/drives" element={<div>驱动器页面开发中...</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
```

- [ ] **Step 2: 创建src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 3: 创建src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-parchment-50: #FAF8F5;
    --color-parchment-100: #F5F0E8;
    --color-parchment-200: #E8DFD0;
    --color-parchment-300: #D4C5A9;
    --color-parchment-400: #C4A35A;
    --color-parchment-500: #B8944F;
    --color-parchment-600: #A67C4A;
    --color-parchment-700: #8B6538;
    --color-parchment-800: #6B4E2D;
    --color-parchment-900: #3D2B1F;
  }

  body {
    @apply font-sans text-parchment-900 bg-parchment-50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-serif;
  }
}

@layer components {
  .glass-effect {
    @apply bg-white/80 backdrop-blur-sm;
  }

  .card-shadow {
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .card-shadow-lg {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-parchment-50;
}

::-webkit-scrollbar-thumb {
  @apply bg-parchment-300 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-parchment-400;
}
```

- [ ] **Step 4: 创建index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deep Cleaner - 深度清理工具</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: 提交主应用**

```bash
git add src/App.tsx src/main.tsx src/index.css index.html
git commit -m "feat: add main App component with routing and global styles"
```

---

## Task 11: 安装依赖并测试构建

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装项目依赖**

```bash
npm install
```

- [ ] **Step 2: 运行类型检查**

```bash
npm run typecheck
```

- [ ] **Step 3: 运行开发服务器**

```bash
npm run dev
```

- [ ] **Step 4: 修复任何类型错误或构建错误**

根据错误信息修复代码问题。

- [ ] **Step 5: 提交最终代码**

```bash
git add .
git commit -m "chore: install dependencies and fix any build issues"
```

---

## Task 12: 推送到GitHub

- [ ] **Step 1: 添加远程仓库**

```bash
git remote add origin https://github.com/ChenYiming-aaa/My-cleaner.git
```

- [ ] **Step 2: 推送代码到GitHub**

```bash
git push -u origin main
```

- [ ] **Step 3: 创建版本标签**

```bash
git tag -a v1.0.0-mvp -m "MVP版本：基础扫描和清理功能"
git push origin v1.0.0-mvp
```

---

## 完成检查清单

- [ ] 项目结构完整
- [ ] Electron主进程和预加载脚本工作正常
- [ ] React应用可以正常启动
- [ ] 仪表盘页面显示正常
- [ ] 扫描功能可以正常工作
- [ ] 清理功能可以正常工作
- [ ] 所有类型检查通过
- [ ] 代码已推送到GitHub
- [ ] 版本标签已创建

**恭喜！MVP版本已完成并推送到GitHub！**
