<template>
  <div id="nav">
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<script>
export default {
  provide() {
    return {
      reload: this.reload,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$user.updateUserInfo()
    })
  },
  data() {
    return {
      isRouterAlive: true,
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
  },
}
</script>

<style lang="scss"></style>
