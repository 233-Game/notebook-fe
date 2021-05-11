<template>
  <div class="note flex_ACenter">
    <!--    左侧功能框-->
    <div class="noteTitle" :style="cssVar">
      <div class="handle flex_ACenter">
        <span class="color_87 font_size_18">{{ noteSlideHandle }}</span>
        <span class="font_size">（{{ noteList.length }} 条笔记）</span>
        <el-popover
          placement="bottom-start"
          :width="210"
          :hide-after="0"
          trigger="click"
          :show-arrow="false"
        >
          <template #reference>
            <div class="addIcon font_size">
              <span>选项</span>
              <i class="el-icon-arrow-down"></i>
            </div>
          </template>
          <ul class="optionCard userSelect" :style="cssVar">
            <li class="optionLi" v-for="(li, indexLi) in sortLi" :key="indexLi">
              {{ li }}
            </li>
          </ul>
        </el-popover>
      </div>
      <scroll
        ref="scroll"
        v-if="noteList.length > 0"
        :scrollWidth="computedWidth"
        scroll-height="calc(100vh - 130px)"
        class="better-scroll"
        @pullLoad="pullUpLoad"
        @pullRush="pullDownRush"
        @searchNote="searchNote"
        :loading="loading"
      >
        <template v-slot:scrollContent>
          <transition-group name="note">
            <div
              class="noteList"
              :class="isCheckNote === index ? 'checkNote' : ''"
              v-for="(item, index) in noteList"
              :key="item.id"
              @click="onCheckNote(index, item)"
            >
              <!--            笔记头-->
              <div class="titleAndOpera">
                <span class="title_content color_87">{{ item.title }}</span>
                <div class="opera">
                  <el-tooltip
                    :hide-after="0"
                    effect="dark"
                    content="分享笔记"
                    placement="bottom"
                  >
                    <i @click.stop.prevent="onOpera(0, index)">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconfenxiang"></use>
                      </svg>
                    </i>
                  </el-tooltip>
                  <el-tooltip
                    :hide-after="0"
                    effect="dark"
                    content="收藏笔记"
                    placement="bottom"
                  >
                    <i @click.stop.prevent="onOpera(1, index)">
                      <svg class="icon" aria-hidden="true">
                        <use :xlink:href="isCollect(item)"></use>
                      </svg>
                    </i>
                  </el-tooltip>
                  <el-tooltip
                    :hide-after="0"
                    effect="dark"
                    content="删除笔记"
                    placement="bottom"
                  >
                    <i @click.stop.prevent="onOpera(2, index)">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconlajilou"></use>
                      </svg>
                    </i>
                  </el-tooltip>
                </div>
              </div>
              <!--            创建时间-->
              <div class="font_size">{{ item.time }}</div>
              <!--            笔记文字内容-->
              <div class="noteContent">{{ item.content }}</div>
            </div>
          </transition-group>
        </template>
      </scroll>
      <!--      当没有笔记时提醒-->
      <el-empty v-else description="点击 + 号，添加笔记"></el-empty>
    </div>
    <!--    右侧编辑栏-->
    <div class="editNote">
      <note-edit
        :titleIsInput="false"
        :head-title="computedTitle"
        :editContent="computedContent"
        v-if="noteList.length > 0"
      >
        <el-tooltip
          :hide-after="0"
          effect="dark"
          content="收藏笔记"
          placement="bottom"
        >
          <i class="editNoteIcon" @click="onOpera(1, isCheckNote)">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="isCollect(noteList[isCheckNote])"></use>
            </svg>
          </i>
        </el-tooltip>
        <el-tooltip
          v-for="(icon, key) in iconList"
          :key="key"
          :hide-after="0"
          effect="dark"
          :content="icon.desc"
          placement="bottom"
        >
          <i class="editNoteIcon">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#' + icon.icon"></use>
            </svg>
          </i>
        </el-tooltip>
      </note-edit>
    </div>
  </div>
</template>

<script>
import scroll from '@/components/basisModule/scroll'
import noteEdit from '@/views/mainPanel/AddNote'
import { getMap } from '../../../common/setStore'
import { reactive } from 'vue'
export default {
  name: 'Note',
  components: {
    scroll,
    noteEdit,
  },
  props: {
    noteSlideHandle: {
      type: String,
      default: '笔记',
    },
  },
  data() {
    return {
      //笔记列表
      noteList: [
        { id: 1, title: 'react', content: 'r', time: '4天前', collect: 1 },
        { id: 2, title: 'js', content: 'j', time: '4天前', collect: 0 },
        { id: 3, title: 'vue', content: 'v', time: '4天前', collect: 1 },
        { id: 4, title: 'jq', content: 'q', time: '4天前', collect: 0 },
        { id: 5, title: 'node', content: 'p', time: '4天前', collect: 1 },
        { id: 1, title: 'react', content: 'r', time: '4天前', collect: 1 },
        { id: 2, title: 'js', content: 'j', time: '4天前', collect: 0 },
        { id: 3, title: 'vue', content: 'v', time: '4天前', collect: 1 },
        { id: 4, title: 'jq', content: 'q', time: '4天前', collect: 0 },
        { id: 5, title: 'node', content: 'p', time: '4天前', collect: 1 },
        { id: 1, title: 'react', content: 'r', time: '4天前', collect: 1 },
        { id: 2, title: 'js', content: 'j', time: '4天前', collect: 0 },
        { id: 3, title: 'vue', content: 'v', time: '4天前', collect: 1 },
        { id: 4, title: 'jq', content: 'q', time: '4天前', collect: 0 },
        { id: 5, title: 'node', content: 'p', time: '4天前', collect: 1 },
      ],
      //选中笔记的样式 需要編輯的筆記的index
      isCheckNote: this.$eNum.isCheckNoteDefault,
      //  下拉刷新的加载图标
      loading: false,
    }
  },
  setup() {
    //排序方式
    let sortLi = reactive([
      '排序方式',
      ' 创建日期（最早优先）',
      '创建日期（最新优先）',
      '更新日期（最早优先）',
      '更新日期（最新优先）',
      '标题（升序排列）',
      '标题（降序排列）',
    ])
    //编辑区图标列表
    let iconList = reactive([
      { desc: '添加标签', icon: 'icon0-57' },
      { desc: '删除笔记', icon: 'iconlajilou' },
      { desc: '复制链接', icon: 'iconfuzhi' },
      { desc: '笔记信息', icon: 'iconinfo' },
    ])
    return {
      sortLi,
      iconList,
    }
  },
  computed: {
    cssVar() {
      let compareWidth = this.$config.compareWidth(1200)
      //true 正常显示 false 特殊处理
      return {
        '--varWidth': compareWidth ? '25%' : '35%',
        '--icon_font_bgc': getMap('IconFontBGC'),
        '--search_list_font_color': getMap('SearchListFontColor'),
      }
    },
    computedWidth() {
      let compareWidth = this.$config.compareWidth(1200)
      return compareWidth
        ? 'calc((100vw - 100px)*0.25)'
        : 'calc((100vw - 100px)*0.35)'
    },
    //  標題
    computedTitle() {
      return this.noteList[this.isCheckNote].title
    },
    //  編輯初始内容
    computedContent() {
      return this.noteList[this.isCheckNote].content
    },
  },
  methods: {
    //上拉加载
    pullUpLoad() {
      setTimeout(() => {
        this.$refs.scroll.closePullUp()
      }, 1000)
    },
    // 下拉刷新
    pullDownRush() {
      this.loading = !this.loading
      setTimeout(() => {
        //调用关闭下拉刷新动作
        this.$refs.scroll.closePullDown()
        this.loading = !this.loading
      }, 1000)
    },
    //搜索
    searchNote(searchValue) {
      console.log(searchValue)
    },
    //  点击了某个笔记
    onCheckNote(index, data) {
      this.isCheckNote = index
      console.log(index, data)
    },
    //  判断是否收藏
    isCollect(data) {
      if (data.collect === 1) {
        return '#iconshoucang'
      }
      return '#iconshoucang1'
    },
    //  左侧功能区图标按钮
    //num
    onOpera(num, index) {
      switch (num) {
        case 0:
          //分享
          console.log('分享')
          break
        case 1:
          //收藏
          this.noteList[index].collect === 1
            ? (this.noteList[index].collect = 0)
            : (this.noteList[index].collect = 1)
          break
        case 2:
          //删除
          this.noteList.splice(index, 1)
          //判断删除的索引值是否在选中索引之前
          if (this.isCheckNote > index) {
            //  在，将当前选中的索引值减1
            this.isCheckNote -= 1
          }
          //判断要删除的笔记是否是当前选中的
          else if (this.isCheckNote === index) {
            //是，则选中该索引的前一个
            this.isCheckNote =
              this.isCheckNote - 1 < 0 ? 0 : this.isCheckNote - 1
          }
          setTimeout(() => {
            this.$refs.scroll.defineFun((that) => {
              that.refresh()
            })
          }, 500)
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'static/style/base';
.note {
  width: 100%;
  height: 100vh;
}
.noteTitle {
  width: var(--varWidth);
  height: 100%;
  border-right: 1px solid #ececec;
  .handle {
    position: relative;
    width: 100%;
    height: 50px;
    padding: 10px 0;
    cursor: default;
    span:first-child {
      display: inline-block;
      margin-left: 20px;
    }
  }
  .addIcon {
    position: absolute;
    right: 20px;
    cursor: pointer;
    vertical-align: middle;
  }
}
.optionCard {
  li {
    padding: 15px 20px;
    cursor: pointer;
  }
  li:hover {
    background-color: var(--icon_font_bgc);
    color: var(--search_list_font_color);
  }
  li:first-child:hover {
    background-color: #fff;
    font-size: 14px !important;
    color: #999999;
    cursor: default;
  }
  li:first-child {
    color: #999999;
    font-size: 14px !important;
  }
}
.editNote {
  flex: 1;
  width: 30%;
  height: 100%;
}
.editNoteIcon {
  outline: none;
}
.noteList {
  box-sizing: border-box;
  width: 100%;
  height: 95px;
  padding: 10px 20px;
  .titleAndOpera {
    position: relative;
    font-size: 18px;
  }
  .title_content {
    display: inline-block;
  }
  .opera {
    display: inline-block;
    position: absolute;
    right: 0;
    i {
      outline: none;
    }
    svg {
      margin-left: 15px;
    }
  }
  .noteContent {
    margin-top: 10px;
    font-size: 14px;
    color: #333333;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
//  笔记选中后的样式
.checkNote {
  border: 3px solid #999999;
}
</style>
<style lang="scss">
.el-popover {
  padding: 0 !important;
}
.note-leave-to {
  opacity: 0;
  transform: translateX(-80px);
}
.note-leave-active {
  transition: all 0.5s ease;
  position: absolute;
}
.note-move {
  transition: all 0.5s ease;
}
</style>
