<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'BarChart',

  props: {
    chartData: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      chart: null,
    }
  },

  mounted() {
    this.renderChart()
  },

  watch: {
    chartData: {
      handler() {
        if (this.chart) {
          this.chart.data = this.chartData
          this.chart.update()
        }
      },
      deep: true,
    },
    options: {
      handler() {
        if (this.chart) {
          this.chart.options = { ...this.chart.options, ...this.options }
          this.chart.update()
        }
      },
      deep: true,
    },
  },

  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  },

  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy()
      }

      const ctx = this.$refs.chartCanvas.getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: this.chartData,
        options: this.options,
      })
    },
  },
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
