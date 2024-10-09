<template>
  <div class="bg-gray-700 p-4 rounded-lg shadow-md">
    <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
    <p class="text-xl">{{ value }}</p>
  </div>
</template>

<script>
export default {
  name: 'StatusCard',
  props: {
    title: String,
    value: [String, Number]
  }
};
</script>
