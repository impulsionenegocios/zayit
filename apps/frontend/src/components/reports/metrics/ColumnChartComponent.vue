<template>
  <div class="card-chart col-span-4 rounded-2xl mb-8 h-full">
    <!-- Força a re-renderização usando uma key derivada dos rótulos/categorias -->
    <VueApexCharts
      :key="chartKey"
      type="bar"
      height="350"
      class="p-4"
      :options="chartOptions"
      :series="formattedSeries"
      :categories="categories" />
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  series: {
    type: Array,
    default: () => [],
  },
  categories: {
    type: Array,
    default: () => [],
  },
  labels: {
    type: Array,
    default: () => [],
  },
  title: {
    type: [String, Array], // Permite String ou Array
    default: 'Dados Principais',
  },
})

const chartCategories = computed(() => {
  return props.categories.length > 0 ? props.categories : props.labels
})

const chartOptions = ref({
  chart: {
    height: 350,
    type: 'bar',
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: [],
    style: {
      color: '#ffffff',
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
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
      colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    },
  },
})

watch(
  chartCategories,
  newCategories => {
    const areDates = newCategories.every(cat => !isNaN(new Date(cat).getTime()))
    if (areDates) {
      chartOptions.value.xaxis.type = 'datetime'
      chartOptions.value.xaxis.categories = newCategories.map(cat =>
        new Date(cat).toISOString(),
      )
    } else {
      chartOptions.value.xaxis.type = 'category'
      chartOptions.value.xaxis.categories = newCategories
    }
  },
  { deep: true, immediate: true },
)

const formattedSeries = computed(() => {
  if (
    props.series.length > 0 &&
    typeof props.series[0] === 'object' &&
    props.series[0].hasOwnProperty('data')
  ) {
    return props.series
  }
  return [{ data: props.series }]
})

const chartKey = computed(() => {
  const areDates = chartCategories.value.every(
    cat => !isNaN(new Date(cat).getTime()),
  )
  if (areDates) {
    return chartCategories.value
      .map(cat => new Date(cat).toISOString())
      .join('-')
  } else {
    return chartCategories.value.join('-')
  }
})
</script>

<style>
.card-chart {
  background-color: #121223;
  border: 1px solid #3b3b74;
}
</style>
