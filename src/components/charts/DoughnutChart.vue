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
    values: number[]
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
    type: 'doughnut',
    data: {
      labels: props.data.labels,
      datasets: [{
        data: props.data.values,
        backgroundColor: [
          '#4f46e5', // indigo
          '#7c3aed', // violet
          '#2563eb', // blue
          '#3b82f6', // light blue
          '#60a5fa', // sky blue
        ],
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: !!props.title,
          text: props.title,
        }
      }
    }
  })
}

watch(() => props.data, () => {
  if (chart) {
    chart.data.labels = props.data.labels
    chart.data.datasets[0].data = props.data.values
    chart.update()
  }
}, { deep: true })

onMounted(() => {
  initChart()
})
</script> 