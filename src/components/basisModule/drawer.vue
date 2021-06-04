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
        <slot name="title">
          <div class="header">
            <span class="color_87 font_size_18">{{ headTitle }}</span>
            <span class="font_size">{{ listNum }}</span>
            <i class="color_87 font_size_18 add_book_icon">
              <svg
                class="icon"
                aria-hidden="true"
                v-for="(item, index) in rightBtn"
                :key="index"
                @click="iconOperate(index)"
              >
                <use :xlink:href="item"></use>
              </svg>
            </i>
          </div>
        </slot>
      </template>
      <slot></slot>
    </el-drawer>
  </div>
</template>

<script>
import { compareWidth } from '../../../common/commonFunction'

export default {
  name: 'drawer',
  props: {
    drawer: {
      default: false,
      type: Boolean,
    },
    headTitle: {
      default: '',
      type: String,
    },
    listNum: {
      default: '',
      type: String,
    },
    rightBtn: {
      default: null,
      type: Array,
    },
  },
  data() {
    return {
      direction: 'ltr',
    }
  },
  computed: {
    drawerSize() {
      let drawerSize = compareWidth(1200)
      //true 正常显示 false 特殊处理
      return drawerSize ? '25%' : '35%'
    },
  },
  methods: {
    closeDrawer() {
      this.$emit('closeDrawer')
    },
    iconOperate(index) {
      this.$emit('iconOperate', index)
    },
  },
}
</script>

<style lang="scss">
.drawer {
  height: 100vh;
}
.header {
  position: relative;
  height: 50px;
}
.add_book_icon {
  position: absolute;
  right: 0;

  .icon {
    margin: 0 10px;
    cursor: pointer;
  }
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
