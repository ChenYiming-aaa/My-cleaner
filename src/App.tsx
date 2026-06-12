import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HardDrive, Scan, Trash2, Files, Loader2 } from 'lucide-react'

interface Drive {
  letter: string
  label: string
  freeSpace: number
  totalSpace: number
  fileSystem: string
  usedSpace: number
}

interface FileItem {
  id: string
  name: string
  path: string
  size: number
  category: string
  riskLevel: 'safe' | 'moderate' | 'dangerous'
  lastModified: string
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function App() {
  const [drives, setDrives] = useState<Drive[]>([])
  const [selectedDrives, setSelectedDrives] = useState<string[]>([])
  const [files, setFiles] = useState<FileItem[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'scan' | 'files'>('scan')

  // 加载驱动器
  useEffect(() => {
    loadDrives()
  }, [])

  const loadDrives = async () => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.getDrives()
        if (result.success) {
          setDrives(result.drives)
          setMessage(`找到 ${result.drives.length} 个驱动器`)
        }
      } else {
        setMessage('请在 Electron 应用中运行')
      }
    } catch (error) {
      console.error('Failed to load drives:', error)
      setMessage('加载驱动器失败')
    }
  }

  // 切换驱动器选择
  const toggleDrive = (letter: string) => {
    setSelectedDrives(prev => 
      prev.includes(letter) 
        ? prev.filter(d => d !== letter)
        : [...prev, letter]
    )
  }

  // 开始扫描
  const handleScan = async () => {
    if (selectedDrives.length === 0) {
      setMessage('请先选择驱动器')
      return
    }

    setIsScanning(true)
    setFiles([])
    setMessage('正在扫描...')

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.scanFiles(selectedDrives)
        setFiles(result.files)
        setMessage(`扫描完成，找到 ${result.totalFiles} 个文件，耗时 ${(result.duration / 1000).toFixed(1)} 秒`)
        setActiveTab('files')
      }
    } catch (error) {
      console.error('Scan failed:', error)
      setMessage('扫描失败')
    } finally {
      setIsScanning(false)
    }
  }

  // 删除文件
  const handleDelete = async (filePaths: string[]) => {
    if (filePaths.length === 0) return

    setIsDeleting(true)
    setMessage('正在删除...')

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.deleteFiles(filePaths)
        setMessage(`删除完成：成功 ${result.success} 个，失败 ${result.failed} 个`)
        // 重新扫描
        await handleScan()
      }
    } catch (error) {
      console.error('Delete failed:', error)
      setMessage('删除失败')
    } finally {
      setIsDeleting(false)
    }
  }

  // 按类别分组
  const filesByCategory = files.reduce((acc, file) => {
    if (!acc[file.category]) {
      acc[file.category] = []
    }
    acc[file.category].push(file)
    return acc
  }, {} as Record<string, FileItem[]>)

  const categoryLabels: Record<string, string> = {
    'cache': '缓存文件',
    'log': '日志文件',
    'installer': '安装包',
    'other': '其他文件',
  }

  return (
    <div className="flex h-screen bg-parchment-50">
      {/* 侧边栏 */}
      <aside className="w-64 bg-white border-r border-parchment-100 p-6">
        <h1 className="text-2xl font-serif font-bold text-parchment-900 mb-2">
          Deep Cleaner
        </h1>
        <p className="text-sm text-parchment-500 mb-8">深度清理工具 v2.0</p>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('scan')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'scan'
                ? 'bg-parchment-100 text-parchment-900 font-medium'
                : 'text-parchment-600 hover:bg-parchment-50'
            }`}
          >
            <Scan size={20} />
            <span>磁盘扫描</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'files'
                ? 'bg-parchment-100 text-parchment-900 font-medium'
                : 'text-parchment-600 hover:bg-parchment-50'
            }`}
          >
            <Files size={20} />
            <span>文件列表</span>
          </button>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* 消息提示 */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-parchment-100 rounded-lg text-parchment-700"
          >
            {message}
          </motion.div>
        )}

        {/* 扫描页面 */}
        {activeTab === 'scan' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-3xl font-serif font-bold text-parchment-900 mb-6">
              磁盘扫描
            </h2>

            {/* 驱动器选择 */}
            <div className="bg-white rounded-xl shadow-sm border border-parchment-100 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <HardDrive size={20} className="text-parchment-600" />
                <h3 className="text-lg font-serif font-semibold text-parchment-900">
                  选择驱动器
                </h3>
                <button 
                  onClick={loadDrives}
                  className="ml-auto text-sm text-parchment-500 hover:text-parchment-700"
                >
                  刷新
                </button>
              </div>
              
              {drives.length === 0 ? (
                <p className="text-parchment-400 text-center py-8">正在加载驱动器...</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {drives.map((drive) => {
                    const isSelected = selectedDrives.includes(drive.letter)
                    const usagePercent = drive.totalSpace > 0 
                      ? (drive.usedSpace / drive.totalSpace) * 100 
                      : 0
                    
                    return (
                      <motion.button
                        key={drive.letter}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleDrive(drive.letter)}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-parchment-500 bg-parchment-50'
                            : 'border-parchment-100 bg-white hover:border-parchment-200'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-parchment-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        
                        <div className="text-left">
                          <p className="text-lg font-semibold text-parchment-900">{drive.letter}</p>
                          <p className="text-sm text-parchment-500">{drive.label}</p>
                          
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-xs text-parchment-500">
                              <span>已使用 {Math.round(usagePercent)}%</span>
                              <span>{formatSize(drive.freeSpace)} 可用</span>
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
              )}
            </div>

            {/* 扫描按钮 */}
            <div className="flex justify-center">
              <button
                onClick={handleScan}
                disabled={selectedDrives.length === 0 || isScanning}
                className="px-8 py-3 bg-parchment-600 text-white rounded-lg hover:bg-parchment-700 disabled:bg-parchment-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isScanning ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    扫描中...
                  </>
                ) : (
                  <>
                    <Scan size={20} />
                    开始扫描
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* 文件列表页面 */}
        {activeTab === 'files' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-serif font-bold text-parchment-900">
                扫描结果
              </h2>
              <span className="text-parchment-500">
                共 {files.length} 个文件
              </span>
            </div>

            {files.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-parchment-100 p-12 text-center">
                <Files size={48} className="mx-auto text-parchment-300 mb-4" />
                <p className="text-parchment-500">暂无扫描结果，请先进行扫描</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(filesByCategory).map(([category, categoryFiles]) => (
                  <div key={category} className="bg-white rounded-xl shadow-sm border border-parchment-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-serif font-semibold text-parchment-900">
                        {categoryLabels[category] || category}
                        <span className="ml-2 text-sm font-normal text-parchment-500">
                          ({categoryFiles.length} 个文件)
                        </span>
                      </h3>
                      <button
                        onClick={() => handleDelete(categoryFiles.map(f => f.path))}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Trash2 size={16} />
                        删除全部
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {categoryFiles.slice(0, 20).map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-parchment-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-parchment-800 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-parchment-400 truncate">
                              {file.path}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <span className="text-sm text-parchment-600">
                              {formatSize(file.size)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              file.riskLevel === 'safe' 
                                ? 'bg-green-100 text-green-700'
                                : file.riskLevel === 'moderate'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}>
                              {file.riskLevel === 'safe' ? '安全' : file.riskLevel === 'moderate' ? '中等' : '危险'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {categoryFiles.length > 20 && (
                        <p className="text-center text-parchment-400 text-sm py-2">
                          ... 还有 {categoryFiles.length - 20} 个文件
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
