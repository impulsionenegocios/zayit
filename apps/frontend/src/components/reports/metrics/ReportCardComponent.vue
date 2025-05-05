<!-- src/components/layout/ReportCardComponent.vue -->
<template>
  <div
    :class="[
      'py-6 px-6 rounded-2xl text-white flex flex-col items-center justify-center relative',
      cardPurple ? 'card-purple' : 'card-default',
    ]">
    <div class="p-8 mb-4">
      <span class="text-xs text-gray-600">{{ documentType }}</span>
      <!-- <div class="w-12 mt-4 h-12 rounded-full m-auto mb-4">
        <img :src="documentPicture" alt="" class="rounded-full" />
      </div> -->
      <div class="flex-col flex">
        <span>{{ documentUsername }}</span>
        <span class="text-xs text-gray-600">{{ documentName }}</span>
      </div>
    </div>
    <div
      class="w-full text-white flex items-center justify-center py-4 absolute bottom-0 rounded-b-2xl">
      <button
        class="bg-zayitorange w-[50%] py-4 absolute bottom-0 left-0 rounded-bl-2xl"
        @click="handleClick">
        {{ documentButtonTitle }}
      </button>
      <button
        class="bg-zayitorange w-[50%] py-4 absolute bottom-0 right-0 rounded-br-2xl"
        @click="handlePublicClick">
        {{ documentButtonTitle2 }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  documentType: String,
  documentPicture: String,
  documentUsername: String,
  documentName: String,
  // Ação para o botão "Ver Relatório"
  documentHref: [String, Function],
  // Ação para o botão "Link Público"
  documentPublicHref: [String, Function],
  documentButtonTitle: String,
  documentButtonTitle2: String,
  cardPurple: {
    type: Boolean,
    default: false,
  },
})

const handleClick = () => {
  if (typeof props.documentHref === 'string') {
    window.open(props.documentHref, '_blank')
  } else if (typeof props.documentHref === 'function') {
    props.documentHref()
  }
}

const handlePublicClick = () => {
  if (typeof props.documentPublicHref === 'string') {
    window.open(props.documentPublicHref, '_blank')
  } else if (typeof props.documentPublicHref === 'function') {
    props.documentPublicHref()
  }
}
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
