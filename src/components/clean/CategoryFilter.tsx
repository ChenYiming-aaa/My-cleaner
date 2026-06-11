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
  onToggleCategory: (categoryId: any) => void
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
