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