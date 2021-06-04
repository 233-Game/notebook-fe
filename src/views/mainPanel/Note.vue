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
        v-if="haveNote"
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
              @click="onCheckNote(index)"
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
              <div class="font_size">{{ item.updated_at }}</div>
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
        :noteId="noteList[isCheckNote].id"
        :titleIsInput="false"
        v-if="noteList.length > 0"
        @changNote="changNote"
        :note-title="noteTitle"
        :note-content="noteContent"
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
          v-for="(icon, iconIndex) in iconList"
          :key="iconIndex"
          :hide-after="0"
          effect="dark"
          :content="icon.desc"
          placement="bottom"
        >
          <i class="editNoteIcon" @click="rightOpera(iconIndex)">
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
import { compareWidth } from '../../../common/commonFunction'
import noteServe from '@/api/noteApi'
import Clipboard from 'clipboard'
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
      noteList: [],
      //选中笔记的样式 需要編輯的筆記的index
      isCheckNote: this.$eNum.isCheckNoteDefault,
      //  下拉刷新的加载图标
      loading: false,
      //  默认笔记页数
      noteDefaultPage: 1,
      //笔记的总页数
      noteTotalPage: 0,
      //  显示scroll还是empty
      haveNote: true,
      //  展示的noteBook内容 -1表示为笔记列表，默认获取所有笔记
      noteBookId: -1,
      //  当前笔记的笔记名
      noteTitle: '',
      //  当前选中笔记的内容
      noteContent: '',
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
      { desc: '删除笔记', icon: 'iconlajilou' },
      { desc: '复制链接', icon: 'iconfuzhi' },
      { desc: '笔记信息', icon: 'iconinfo' },
    ])
    //获取笔记列表
    function getNote(page) {
      return noteServe.getDefaultNote(page).then((res) => {
        res.data.data.total > 0
          ? (this.haveNote = true)
          : (this.haveNote = false)
        this.noteTotalPage = res.data.data.total_pages
        return res
      })
    }
    //删除笔记
    function delNote(noteId) {
      noteServe.delNote(noteId).then((res) => {
        console.log(res)
      })
    }
    //获取具体的笔记
    function getNoteContent(noteId) {
      return noteServe.getNoteContent(noteId).then((res) => res)
    }

    return {
      sortLi,
      iconList,
      getNote,
      delNote,
      getNoteContent,
    }
  },
  computed: {
    cssVar() {
      let width = compareWidth(1200)
      //true 正常显示 false 特殊处理
      return {
        '--varWidth': width ? '25%' : '35%',
        '--icon_font_bgc': getMap('IconFontBGC'),
        '--search_list_font_color': getMap('SearchListFontColor'),
      }
    },
    computedWidth() {
      let width = compareWidth(1200)
      return width ? 'calc((100vw - 100px)*0.25)' : 'calc((100vw - 100px)*0.35)'
    },
  },
  async created() {
    //路由调转获取指定的笔记
    let noteId = this.$router.currentRoute.value.noteId
    if (noteId) {
      return
    }
    //路由调转获取指定的笔记本
    // let noteBookId = this.$router.currentRoute.value.noteBookId
    //获取默认笔记列
    await this.getNote(this.noteDefaultPage).then((res) => {
      this.noteList = res.data.data.list
    })
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
    async onCheckNote(index) {
      this.$baseFun.__loading('加载中')
      this.isCheckNote = index
      await this.getNoteContent(this.noteList[index].id).then((res) => {
        this.headTitle = res.data.data.title
        this.noteContent = res.data.data.content
      })
      this.$baseFun.__closeLoading()
    },
    //  判断是否收藏
    isCollect(data) {
      if (data.collect === 1) {
        return '#iconshoucang'
      }
      return '#iconshoucang1'
    },
    //  左侧功能区图标按钮
    //num 笔记分享删除等操作
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
          this.delNote(this.noteList[index].id)
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
    //  修改侧边栏笔记摘要
    changNote(data) {
      this.noteList[this.isCheckNote].title = data.title
      this.noteList[this.isCheckNote].content = data.content
      this.noteList[this.isCheckNote].updated_at = data.updated_at
    },
    //  右侧编辑区功能键 删除 复制链接等操作
    rightOpera(currentIndex) {
      switch (currentIndex) {
        //删除笔记
        case 0:
          this.onOpera(2, this.isCheckNote)
          break
        //复制链接
        case 1:
          var copy = new Clipboard('.editNoteIcon', {
            text: () => window.location.href,
          })
          copy.on('success', () => {
            this.$baseFun.__message('复制成功', 'success')
          })
          break
        //获取笔记详情
        case 2:
          console.log('获取详情')
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
