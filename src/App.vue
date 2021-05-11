<template>
  <div id="nav">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted() {
    this.$nextTick(() => {
      this.$user.setUserInfo()
    })
  },
}
</script>

<style lang="scss"></style>
