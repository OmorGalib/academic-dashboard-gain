'use client'

import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  )
})

interface DynamicChartProps {
  options: ApexOptions
  series: any[]
  type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'treemap'
  height?: number | string
  width?: number | string
}

export default function DynamicChart({ 
  options, 
  series, 
  type, 
  height = 350, 
  width = '100%' 
}: DynamicChartProps) {
  return (
    <Chart
      options={options}
      series={series}
      type={type}
      height={height}
      width={width}
    />
  )
}