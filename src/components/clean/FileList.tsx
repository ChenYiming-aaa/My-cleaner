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
