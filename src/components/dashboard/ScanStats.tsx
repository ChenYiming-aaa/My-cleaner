
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
