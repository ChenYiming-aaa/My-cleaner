
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
