<template>
  <div class="V-MyScroll" :style="({ width: scrollWidth }, cssVars)">
    <slot name="searchInput">
      <div class="searchBox flex_ACenter">
        <el-input
          prefix-icon="el-icon-search"
          placeholder="请输入查找内容"
          maxlength="30"
          v-model="searchValue"
          @keyup.enter="search()"
          clearable
        >
        </el-input>
      </div>
    </slot>
    <div
      class="scroll"
      ref="wrapper"
      :style="{ width: scrollWidth, maxHeight: scrollHeight }"
    >
      <div style="transform: translateY(0)">
        <slot name="scrollContent">
          <div class="creatNote">
            <i class="el-icon-folder-add createIcon"></i>
            创建笔记本
          </div>
          <div
            class="noteList"
            v-for="(item, index) in list"
            :key="index"
            :class="checkNoteBook === index ? 'isCheckNote' : ''"
            @click="checkItem(index, item.id)"
          >
            <div class="flex_ACenter noteBookItem">
              <span>{{ item }}</span>
              <i
                v-if="checkNoteBook === index"
                class="el-icon-success checkIcon"
              ></i>
            </div>
          </div>
        </slot>
      </div>
    </div>
    <!--                移动笔记的上拉加载框-->
    <div v-if="loading" class="V-Loading">
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>

<script>
import { getMap } from '../../../common/setStore'

export default {
  name: 'scroll',
  props: {
    //是否加载
    loading: {
      default: false,
      type: Boolean,
    },
    //渲染的列表
    list: {
      default: null,
      type: Array,
    },
    //  scrollHeight
    scrollHeight: {
      default: '100%',
      type: String,
    },
    scrollWidth: {
      default: '100%',
      type: String,
    },
  },
  computed: {
    cssVars() {
      // 状态管理修改颜色==
      return {
        '--icon_font_bgc': getMap('IconFontBGC'),
        '--search_list_font_color': getMap('SearchListFontColor'),
      }
    },
  },
  data() {
    return {
      //搜索的关键字
      searchValue: '',
      //  scroll
      scroll: null,
      //  选中的noteBook
      checkNoteBook: 0,
    }
  },
  mounted() {
    //  启用scroll
    this.$nextTick(() => {
      this.initScroll()
    })
  },
  methods: {
    //初始化scroll
    initScroll() {
      this.scroll = this.$config.__init_scroll(this.$refs.wrapper)
      this.$config.__pulling(this.scroll, 'pullingDown', () => {
        this.$emit('pullRush', this.scroll)
      })
      this.$config.__pulling(this.scroll, 'pullingUp', () => {
        this.$emit('pullLoad', this.scroll)
      })
    },
    //  搜索
    search() {
      this.$emit('searchNote', this.searchValue)
      this.searchValue = ''
    },
    //  选中列表
    checkItem(index, id) {
      this.checkNoteBook = index
      this.$emit('checkNoteBook', id)
    },
  },
}
</script>

<style lang="scss">
@import '../../../static/style/base';
.V-MyScroll {
  position: absolute;
  z-index: 7;
  background-color: #fff;
  box-shadow: 0 0 10px 3px rgba(#cccccc, 0.6);
  border-radius: 5px;
  .searchBox {
    box-sizing: border-box;
    position: relative;
    z-index: 9;
    width: 100%;
    border-bottom: 1px solid #e1e1e1;
    height: 60px;
    padding: 20px;
    background-color: #fff;
    .el-input__inner {
      width: 100%;
      border: 1px solid #e1e1e1;
      outline: none;
    }
  }
  .scroll {
    position: relative;
    width: 100%;
    overflow: hidden;
    z-index: 9;
  }
  .noteList,
  .creatNote {
    font-size: 14px;
    font-weight: 400;
    width: 100%;
    cursor: pointer;
  }
  .createIcon {
    font-size: 20px;
    font-weight: bold;
    vertical-align: middle;
    margin-right: 10px;
  }
  .noteList:hover {
    background-color: var(--icon_font_bgc);
    color: var(--search_list_font_color);
  }
  .creatNote:hover {
    color: #2cbd5f;
  }
  .isCheckNote {
    color: #2cbd5f;
  }
  .noteBookItem,
  .creatNote {
    box-sizing: border-box;
    width: calc(100% - 20px);
    margin: 0 10px;
    padding: 0 10px;
    border-bottom: 1px solid #e1e1e1;
  }
  .checkIcon {
    display: inline-block;
    position: absolute;
    right: 20px;
    font-size: 16px;
  }
  .V-Loading {
    display: inline-block;
    position: absolute;
    top: 70px;
    width: 400px;
    text-align: center;
    z-index: 10;
    font-size: 20px;
  }
}
</style>
