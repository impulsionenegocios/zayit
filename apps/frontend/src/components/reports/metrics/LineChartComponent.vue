<template>
  <div class="card-chart col-span-4 rounded-2xl mb-8 h-full">
    <VueApexCharts
      type="line"
      height="350"
      class="p-4"
      :options="chartOptions"
      :series="series" />
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  series: {
    type: Array,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: 'Dados Principais',
  },
})

const chartOptions = computed(() => ({
  chart: {
    height: 350,
    type: 'line', // Alterado para 'line' para consistência com o tipo declarado
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    width: 5,
    curve: 'smooth',
  },
  xaxis: {
    type: 'datetime',
    categories: props.categories,
    tickAmount: 10,
    labels: {
      formatter: function (value) {
        return new Date(value).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
        })
      },
    },
  },
  title: {
    text: props.title,
    align: 'left',
    style: {
      fontSize: '16px',
      color: '#ffffff',
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: ['#343468'],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100, 100, 100],
    },
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    labels: {
      colors: ['#ffffff', '#ffffff'],
    },
  },
  yaxis: [
    {
      title: {
        text: props.series[0]?.name || 'Métrica Principal',
        style: { color: '#ffffff' },
      },
      labels: { style: { colors: '#ffffff' } },
    },
    {
      opposite: true,
      title: {
        text: props.series[1]?.name || 'Custo por Métrica',
        style: { color: '#ffffff' },
      },
      labels: { style: { colors: '#ffffff' } },
    },
  ],
}))
</script>

<style>
.card-chart {
  background-color: #121223;
  border: 1px solid #3b3b74;
}
</style>
