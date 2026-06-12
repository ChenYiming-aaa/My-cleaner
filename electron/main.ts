import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// 简单直接的磁盘检测方法 - 使用 fs.accessSync
function detectDrives(): any[] {
  const drives = []
  const letters = 'CDEFGHIJKLMNOPQRSTUVWXYZ'
  
  for (const letter of letters) {
    const drivePath = `${letter}:\\`
    try {
      // 直接检查路径是否存在
      fs.accessSync(drivePath, fs.constants.R_OK)
      
      // 尝试获取磁盘空间信息
      try {
        const output = execSync(
          `wmic logicaldisk where "DeviceID='${letter}:'" get FreeSpace,Size,VolumeName,FileSystem /format:csv`,
          { encoding: 'utf8', timeout: 5000 }
        )
        
        const lines = output.trim().split('\n').filter(l => l.trim())
        if (lines.length > 1) {
          const parts = lines[1].trim().split(',')
          if (parts.length >= 5) {
            drives.push({
              letter: `${letter}:`,
              label: parts[3] || 'Local Disk',
              freeSpace: parseInt(parts[1]) || 0,
              totalSpace: parseInt(parts[2]) || 0,
              fileSystem: parts[4] || 'NTFS',
              usedSpace: (parseInt(parts[2]) || 0) - (parseInt(parts[1]) || 0),
            })
            continue
          }
        }
      } catch {
        // wmic 失败，添加基本条目
      }
      
      // 如果 wmic 失败，添加一个基本条目
      drives.push({
        letter: `${letter}:`,
        label: 'Local Disk',
        freeSpace: 0,
        totalSpace: 0,
        fileSystem: 'NTFS',
        usedSpace: 0,
      })
    } catch {
      // 驱动器不存在
    }
  }
  
  return drives
}

// 注册 IPC 处理程序
function setupIPC() {
  // 获取磁盘驱动器
  ipcMain.handle('get-drives', async () => {
    try {
      const drives = detectDrives()
      return { success: true, drives }
    } catch (error) {
      console.error('Failed to get drives:', error)
      return { 
        success: true, 
        drives: [{ letter: 'C:', label: 'Local Disk', freeSpace: 0, totalSpace: 0, fileSystem: 'NTFS', usedSpace: 0 }] 
      }
    }
  })

  // 扫描文件
  ipcMain.handle('scan-files', async (_event, drives: string[]) => {
    const files: any[] = []
    const startTime = Date.now()
    
    for (const drive of drives) {
      try {
        scanDirectory(`${drive}\\`, files, 0, 10)
      } catch (error) {
        console.error(`Failed to scan ${drive}:`, error)
      }
    }
    
    return {
      files,
      totalFiles: files.length,
      duration: Date.now() - startTime
    }
  })

  // 删除文件
  ipcMain.handle('delete-files', async (_event, filePaths: string[]) => {
    let success = 0
    let failed = 0
    
    for (const filePath of filePaths) {
      try {
        fs.unlinkSync(filePath)
        success++
      } catch {
        failed++
      }
    }
    
    return { success, failed }
  })
}

// 递归扫描目录
function scanDirectory(dirPath: string, files: any[], depth: number, maxDepth: number) {
  if (depth > maxDepth) return
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      
      try {
        if (entry.isDirectory()) {
          // 跳过系统目录
          if (!entry.name.startsWith('.') && 
              !['$Recycle.Bin', 'System Volume Information', 'Windows', 'node_modules'].includes(entry.name)) {
            scanDirectory(fullPath, files, depth + 1, maxDepth)
          }
        } else if (entry.isFile()) {
          const stat = fs.statSync(fullPath)
          files.push({
            id: `file-${files.length}`,
            name: entry.name,
            path: fullPath,
            size: stat.size,
            category: categorizeFile(entry.name, fullPath),
            riskLevel: assessRisk(entry.name, fullPath),
            lastModified: stat.mtime.toISOString(),
          })
        }
      } catch {
        // 忽略无法访问的文件
      }
    }
  } catch {
    // 忽略无法访问的目录
  }
}

function categorizeFile(fileName: string, filePath: string): string {
  const ext = path.extname(fileName).toLowerCase()
  const lowerPath = filePath.toLowerCase()

  if (lowerPath.includes('\\cache\\') || lowerPath.includes('\\temp\\') || ext === '.tmp') {
    return 'cache'
  }
  if (ext === '.log' || ext === '.etl') {
    return 'log'
  }
  if (['.exe', '.msi'].includes(ext)) {
    return 'installer'
  }
  return 'other'
}

function assessRisk(fileName: string, filePath: string): 'safe' | 'moderate' | 'dangerous' {
  const lowerPath = filePath.toLowerCase()
  
  if (lowerPath.includes('\\windows\\system32')) {
    return 'dangerous'
  }
  if (lowerPath.includes('\\cache\\') || lowerPath.includes('\\temp\\')) {
    return 'safe'
  }
  return 'moderate'
}

app.whenReady().then(() => {
  createWindow()
  setupIPC()

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
