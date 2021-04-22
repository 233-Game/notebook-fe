<template>
  <drawer :drawer="signDrawer">
    <template v-slot:title> qweqwe </template>
  </drawer>
</template>

<script>
import drawer from '@/components/basisModule/drawer'

export default {
  name: 'sign',
  props: {
    signDrawer: {
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
