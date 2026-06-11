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