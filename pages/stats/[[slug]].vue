<template>
  <div />
</template>

<script setup lang="ts">
const { params: { slug } } = useRoute();
await navigateTo(`https://go.dm.new/stats/${slug.toString()}`, { external: true });
</script>
