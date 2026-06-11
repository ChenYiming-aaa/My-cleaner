export interface ElectronAPI {
  startScan: (drives: string[]) => Promise<{ success: boolean; error?: string }>
  pauseScan: () => Promise<void>
  resumeScan: () => Promise<void>
  cancelScan: () => Promise<void>
  getDrives: () => Promise<{ success: boolean; drives?: import('./index').Drive[]; error?: string }>
  cleanFiles: (fileIds: string[], useRecycleBin: boolean) => Promise<{ success: boolean; error?: string }>
  onScanProgress: (callback: (progress: import('./index').ScanProgress) => void) => void
  onScanComplete: (callback: (result: import('./index').ScanResult) => void) => void
  onScanError: (callback: (error: string) => void) => void
  removeAllListeners: (channel: string) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
