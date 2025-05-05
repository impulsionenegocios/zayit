<template>
  <div class="card-chart col-span-4 rounded-2xl mb-8 h-full">
    <!-- Forçamos a re-renderização do gráfico ao mudar os labels -->
    <VueApexCharts
      :key="chartKey"
      type="donut"
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
  labels: {
    type: Array,
    required: true,
  },
  title: {
    // Novo prop para o título
    type: String,
    default: 'Dados Principais', // Valor padrão caso não seja passado
  },
})

// Cria um objeto computado para as opções, atualizado com base nos props
const chartOptions = computed(() => ({
  chart: {
    height: 350,
    type: 'donut',
  },
  labels: props.labels, // Labels continuam vindo do prop
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    labels: {
      colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    },
  },
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 270,
    },
  },
  fill: {
    type: 'gradient',
  },
  stroke: {
    width: 0,
    curve: 'smooth',
  },
  title: {
    text: props.title, // Usa o prop title recebido
    style: {
      fontSize: '16px',
      color: '#ffffff',
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          labels: {
            colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
          },
        },
      },
    },
  ],
}))

const chartKey = computed(() => props.labels.join('-'))
</script>

<style>
.card-chart {
  background-color: #121223;
  border: 1px solid #3b3b74;
}
</style>
