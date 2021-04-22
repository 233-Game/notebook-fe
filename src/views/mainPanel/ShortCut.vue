<template>
  <drawer :drawer="shortDrawer">
    <template v-slot:title> qweqwe </template>
  </drawer>
</template>

<script>
import drawer from '@/components/basisModule/drawer'

export default {
  name: 'ShortCut',
  props: {
    shortDrawer: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    drawer,
  },
}
</script>

<style scoped></style>
