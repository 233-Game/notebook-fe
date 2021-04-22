<template>
  <div class="drawer">
    <el-drawer
      :model-value="drawer"
      :direction="direction"
      :show-close="false"
      :destroy-on-close="true"
      :size="drawerSize"
      @close="closeDrawer"
    >
      <template v-slot:title>
        <slot name="title"></slot>
      </template>
      <slot></slot>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'drawer',
  props: {
    drawer: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      direction: 'ltr',
    }
  },
  computed: {
    drawerSize() {
      let drawerSize = this.$config.compareWidth(1200)
      //true 正常显示 false 特殊处理
      return drawerSize ? '25%' : '35%'
    },
  },
  methods: {
    closeDrawer() {
      this.$emit('closeDrawer')
    },
  },
}
</script>

<style lang="scss">
.drawer {
  height: 100vh;
}
.el-drawer.ltr {
  margin-left: 100px !important;
}
.el-overlay {
  background-color: rgba(#ffffff, 0.5);
  z-index: 30 !important;
}
.el-drawer__header {
  margin-bottom: 0 !important;
}
</style>
