<template>
  <div class="w-full h-full">
    <canvas ref="chartCanvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  timeframe: {
    type: String,
    default: '24h'
  }
})

const chartCanvas = ref(null)
let chart = null

// Mock Chart.js-like implementation for now
// In a real app, you'd use Chart.js, D3.js, or another charting library

const initChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  const canvas = chartCanvas.value
  const rect = canvas.getBoundingClientRect()
  
  // Set canvas size
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  
  drawChart(ctx, rect.width, rect.height)
}

const drawChart = (ctx, width, height) => {
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  const margin = { top: 20, right: 20, bottom: 40, left: 40 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom
  
  // Mock data for demonstration
  const dataPoints = props.data.length > 0 ? props.data : generateMockData()
  const maxValue = Math.max(...dataPoints.map(d => Math.max(d.opens || 0, d.clicks || 0, d.deliveries || 0)))
  
  // Draw grid lines
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  
  // Horizontal grid lines
  for (let i = 0; i <= 5; i++) {
    const y = margin.top + (chartHeight / 5) * i
    ctx.beginPath()
    ctx.moveTo(margin.left, y)
    ctx.lineTo(margin.left + chartWidth, y)
    ctx.stroke()
  }
  
  // Vertical grid lines
  const xStep = chartWidth / (dataPoints.length - 1)
  for (let i = 0; i < dataPoints.length; i++) {
    const x = margin.left + xStep * i
    ctx.beginPath()
    ctx.moveTo(x, margin.top)
    ctx.lineTo(x, margin.top + chartHeight)
    ctx.stroke()
  }
  
  // Draw lines
  const drawLine = (dataKey, color) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    
    dataPoints.forEach((point, index) => {
      const x = margin.left + xStep * index
      const y = margin.top + chartHeight - ((point[dataKey] || 0) / maxValue) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()
    
    // Draw points
    ctx.fillStyle = color
    dataPoints.forEach((point, index) => {
      const x = margin.left + xStep * index
      const y = margin.top + chartHeight - ((point[dataKey] || 0) / maxValue) * chartHeight
      
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
  }
  
  // Draw different metrics
  drawLine('deliveries', '#3b82f6') // Blue for deliveries
  drawLine('opens', '#10b981') // Green for opens
  drawLine('clicks', '#8b5cf6') // Purple for clicks
  
  // Draw legend
  const legendItems = [
    { label: 'Deliveries', color: '#3b82f6' },
    { label: 'Opens', color: '#10b981' },
    { label: 'Clicks', color: '#8b5cf6' }
  ]
  
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'left'
  
  legendItems.forEach((item, index) => {
    const x = margin.left + index * 80
    const y = height - 15
    
    // Legend color box
    ctx.fillStyle = item.color
    ctx.fillRect(x, y - 8, 12, 8)
    
    // Legend text
    ctx.fillStyle = '#374151'
    ctx.fillText(item.label, x + 16, y - 2)
  })
  
  // Draw axis labels
  ctx.fillStyle = '#6b7280'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  
  // X-axis labels (time)
  dataPoints.forEach((point, index) => {
    if (index % Math.ceil(dataPoints.length / 6) === 0) {
      const x = margin.left + xStep * index
      const label = getTimeLabel(point.hour || index, props.timeframe)
      ctx.fillText(label, x, height - 5)
    }
  })
  
  // Y-axis labels (values)
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const y = margin.top + (chartHeight / 5) * i
    const value = Math.round(maxValue * (1 - i / 5))
    ctx.fillText(value.toString(), margin.left - 5, y + 3)
  }
}

const generateMockData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  return hours.map(hour => ({
    hour,
    deliveries: Math.floor(Math.random() * 200) + 100,
    opens: Math.floor(Math.random() * 100) + 50,
    clicks: Math.floor(Math.random() * 30) + 10
  }))
}

const getTimeLabel = (hour, timeframe) => {
  if (timeframe === '24h') {
    return `${hour}:00`
  } else if (timeframe === '7d') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[hour % 7]
  } else {
    return `Day ${hour + 1}`
  }
}

const handleResize = () => {
  if (chartCanvas.value) {
    initChart()
  }
}

watch(() => props.data, () => {
  initChart()
}, { deep: true })

watch(() => props.timeframe, () => {
  initChart()
})

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
