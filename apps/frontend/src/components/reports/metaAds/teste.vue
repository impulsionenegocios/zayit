
<template>
    <div>
        <ReportCardComponent 
            class="max-w-96"
            documentType="Tipo"
            documentUsername="Username"
            documentName="name"
            documentHref="#"
            documentButtonTitle="Botão"
            documentButtonTitle2="Teste 2"
            :cardPurple="true"
        />

        <ColumnChartComponent 
        :categories="categories" 
        :series="series"
        title="Performance Semanal"
        />

        <LineChartComponent
        :categories="categories" 
        :series="series"
        title="Performance Semanal"
        />

        <DonutChartComponent 
        :series="series"
        :labels="categories"
        title="Performance Semanal"
        />
        <MetricCardComponent 
        title="teste"
        value="5"
        />
    </div>
    
</template>

<script setup lang="ts">
import ColumnChartComponent from '../metrics/ColumnChartComponent.vue';
import ReportCardComponent from '../metrics/ReportCardComponent.vue';
import LineChartComponent from '../metrics/LineChartComponent.vue';
import DonutChartComponent from '../metrics/DonutChartComponent.vue';
import MetricCardComponent from '../metrics/MetricCardComponent.vue';

const categories = [
  '2025-04-01',
  '2025-04-02',
  '2025-04-03',
  '2025-04-04',
  '2025-04-05',
  '2025-04-06',
  '2025-04-07',
];

const series = [
  {
    name: 'Custo por Lead (CPL)',
    data: [5.2, 4.8, 5.6, 6.1, 4.7, 5.9, 4.4],
  },
  {
    name: 'Mensagens WhatsApp',
    data: [120, 135, 115, 140, 130, 150, 125],
  },
];



</script>
