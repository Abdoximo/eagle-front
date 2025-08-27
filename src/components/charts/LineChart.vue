<template>
  <div class="relative h-[300px] w-full">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps<{
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor?: string
      backgroundColor?: string
    }[]
  }
  title?: string
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const initChart = () => {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.data.labels,
      datasets: props.data.datasets.map(dataset => ({
        ...dataset,
        borderColor: dataset.borderColor || '#4f46e5',
        backgroundColor: dataset.backgroundColor || 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: !!props.title,
          text: props.title,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

watch(() => props.data, () => {
  if (chart) {
    chart.data.labels = props.data.labels
    chart.data.datasets = props.data.datasets.map(dataset => ({
      ...dataset,
      borderColor: dataset.borderColor || '#4f46e5',
      backgroundColor: dataset.backgroundColor || 'rgba(79, 70, 229, 0.1)',
      tension: 0.4,
      fill: true
    }))
    chart.update()
  }
}, { deep: true })

onMounted(() => {
  initChart()
})
</script> 