<template>
  <div :style="cssVar">
    <!-- 单级目录 -->
    <el-menu-item
      v-if="node.children === undefined || node.children.length === 0"
      :index="node.id"
      class="menu"
    >
      <template #title>
        <svg class="icon moreMenu" aria-hidden="true">
          <use xlink:href="#iconwenjian1"></use>
        </svg>
        <span class="font_size_16">{{ node.label }}</span>
        <i @click.stop.prevent="submenuBtn(node.id, 2)">
          <svg class="icon delCollectIcon" aria-hidden="true">
            <use xlink:href="#iconlajilou"></use>
          </svg>
        </i>
      </template>
    </el-menu-item>
    <!-- 多级目录 -->
    <el-submenu v-else :index="node.id" class="menu">
      <template #title>
        <svg class="icon moreMenu" aria-hidden="true">
          <use xlink:href="#iconwenjian"></use>
        </svg>
        <span class="font_size_16">{{ node.label }}</span>
        <div class="flex_ACenter delCollectIcon">
          <i
            v-if="isCollect === false"
            @click.stop.prevent="submenuBtn(node.id, 2)"
          >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconlajilou"></use>
            </svg>
          </i>
          <el-tooltip
            v-else
            :hide-after="0"
            effect="dark"
            :content="item.desc"
            placement="bottom"
            v-for="(item, index) in submenuOption"
            :key="index"
          >
            <i @click.stop.prevent="submenuBtn(node.id, index)">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="item.icon"></use>
              </svg>
            </i>
          </el-tooltip>
        </div>
      </template>
      <!-- 调用组件本身实现循环调用 -->
      <fileMenu
        v-for="(res, key) in node.children"
        :key="key"
        :node="res"
        class="fileMenu"
        @menuOptions="submenuBtn"
      ></fileMenu>
    </el-submenu>
  </div>
</template>

<script>
import { getMap } from '../../../common/setStore'
import { reactive } from 'vue'

export default {
  name: 'fileMenu',
  props: {
    node: {
      default: null,
      type: Object,
    },
    //  是否是收藏，是则将提供添加文件等按钮
    isCollect: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    //多级栏icon
    let submenuOption = reactive([
      { icon: '#icontianjiawenjianjia', desc: '新建文件夹' },
      { icon: '#icontianjiawenjian', desc: '新建markDown文件' },
      { icon: '#iconlajilou', desc: '删除' },
    ])
    return {
      submenuOption,
    }
  },
  computed: {
    cssVar() {
      //true 正常显示 false 特殊处理
      return {
        '--icon_font_bgc': getMap('IconFontBGC'),
        '--search_list_font_color': getMap('SearchListFontColor'),
      }
    },
  },
  methods: {
    //  菜单选项
    submenuBtn(id, index) {
      this.$emit('menuOptions', id, index)
    },
  },
}
</script>

<style lang="scss">
@import 'static/style/base';
.menu {
  position: relative;
}
.moreMenu {
  font-size: 18px;
  color: #cccccc;
  padding-right: 10px;
}
.delCollectIcon {
  position: absolute;
  display: inline-block;
  right: 50px;
  top: 50%;
  transform: translateY(-55%);
  visibility: hidden;
  font-size: 20px;
}
.el-submenu__title:hover,
.el-menu-item:hover {
  background-color: var(--icon_font_bgc);
  color: var(--search_list_font_color);
}
.el-submenu__title:hover .delCollectIcon,
.el-menu-item:hover .delCollectIcon {
  visibility: visible;
}
.icon {
  display: inline-block;
  padding: 0 5px;
}
</style>
