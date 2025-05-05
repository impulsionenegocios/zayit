<template>
  <div
    :class="[
      'h-40 py-4 px-4 rounded-2xl card-two text-white flex flex-col items-baseline justify-evenly',
      props.cardPurple ? 'card-purple' : 'card-default',
    ]">
    <div
      class="icon-box w-8 h-8 flex justify-center items-center border-[1px] border-[#4a4a90] rounded-full">
      <Icon
        :icon="props.metricIcon"
        class="icon text-white text-lg -mt-[1px]" />
    </div>
    <div>
      <div class="text-[11px] mt-4 font-light text-left">{{ props.title }}</div>
      <div class="mt-2 text-2xl text-left">{{ formattedValue }}</div>
    </div>
    <div
      v-if="props.descValue || props.descTitle"
      class="text-xs text-gray-600">
      {{ props.descValue }} {{ props.descTitle }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  title: String,
  value: String,
  cardPurple: {
    type: Boolean,
    default: false,
  },
  metricIcon: String,
  isReal: Boolean,
  descValue: Number,
  descTitle: String,
})

const formattedValue = computed(() => {
  // Se isReal for true, formata com 2 casas decimais e adiciona "R$ "
  if (props.isReal) {
    return `R$ ${Number(props.value).toFixed(2)}`
  }
  // Caso contrário, retorna o valor como está (sem forçar casas decimais)
  return props.value
})
</script>

<style>
.card-default {
  border: 0.001em solid #343468;
  background-color: rgb(26, 26, 65);
  background-image: linear-gradient(
    45deg,
    rgb(26, 26, 65) 0%,
    rgba(27, 27, 191, 0.321) 100%
  );
}

.card-purple {
  border: 0.001em solid #343468;
  background-color: #1a1a41;
  background-image: linear-gradient(
    45deg,
    rgb(26, 26, 65) 0%,
    rgba(131, 27, 191, 0.321) 100%
  );
}
</style>
