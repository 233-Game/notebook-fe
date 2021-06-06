<template>
  <div class="note flex_ACenter">
    <!--    左侧功能框-->
    <div class="noteTitle" :style="cssVar">
      <div class="handle flex_ACenter">
        <span class="color_87 font_size_18">{{ computedName }}</span>
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
        :scrollWidth="computedWidth"
        scroll-height="calc(100vh - 130px)"
        class="better-scroll"
        @pullLoad="pullUpLoad"
        @pullRush="pullDownRush"
        @searchNote="searchNote"
        :loading="loading"
      >
        <template v-slot:scrollContent>
          <div v-if="haveNote">
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
          </div>
          <!--      当没有笔记时提醒-->
          <el-empty v-else description="点击 + 号，添加笔记"></el-empty>
        </template>
      </scroll>
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
    <Tip
      ref="delNote"
      tip-icon="#iconsousuo_lajitong"
      tip-title="删除笔记"
      @definite="definiteDeleteNote"
    >
      <div class="font_size_30 msgTip">确定删除该笔记吗?</div>
    </Tip>
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
import Tip from '@/components/panel/Tip'
// import signServe from "@/api/signApi";
export default {
  name: 'Note',
  components: {
    scroll,
    noteEdit,
    Tip,
  },
  inject: ['reload'], //注入reload方法
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
      //  搜索笔记的关键字
      searchNoteKey: '',
      //  下拉加载类型 默认笔记
      loadOption: 'note',
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
    function getNoteList(page) {
      this.loadOption = 'note'
      let params = {}
      params.page = page
      noteServe.getDefaultNote(params).then((res) => {
        console.log(res)
        this.noteTotalPage = res.data.data.total_pages
        //没有笔记时
        this.judgeData(res.data.data.list)
      })
    }
    //删除笔记
    // function delNote(noteId) {
    //   noteServe.delNote(noteId).then((res) => {
    //     console.log(res)
    //   })
    // }
    //获取具体的笔记
    function getNoteContent(noteId) {
      return noteServe.getNoteContent(noteId).then((res) => res)
    }
    //收藏笔记
    function collectNote(noteId) {
      return noteServe.collectNote(noteId).then((res) => res)
    }
    //取消收藏笔记
    function cancelCollect(noteId) {
      return noteServe.cancelCollectNote(noteId).then((res) => res)
    }
    //  获取笔记本中的笔记
    function getNoteInNoteBook(noteBookId, page) {
      this.loadOption = 'noteBook'
      this.noteList = []
      let params = {}
      params.notebook_id = noteBookId
      params.page = page
      noteServe.getDefaultNote(params).then((res) => {
        this.noteTotalPage = res.data.data.total_pages
        this.judgeData(res.data.data.list)
      })
    }
    //  获取标签中的笔记
    // function getNoteInSign(signId, page) {
    //   this.loadOption = 'sign'
    //   this.noteList = []
    //   noteBookServe.getNoteInSign(signId, page).then((res) => {
    //     this.noteList = res.data.data.list()
    //   })
    // }
    return {
      sortLi,
      iconList,
      getNoteList,
      getNoteContent,
      collectNote,
      getNoteInNoteBook,
      cancelCollect,
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
    computedName() {
      let name = this.$router.currentRoute.value.query.name
      this.getData()
      if (name) {
        return name
      } else {
        return this.noteSlideHandle
      }
    },
  },
  created() {
    // this.getData()
    //用于强制刷新
    this.$config.noteReload = this
  },
  methods: {
    //  获取标签中的笔记
    async getNoteInSign(signId, page) {
      console.log(signId, page)
      this.loadOption = 'sign'
      this.noteList = []
      let params = {}
      params.tag_id = signId
      params.page = page
      await noteServe.getDefaultNote(params).then((res) => {
        this.noteList = res.data.data.list
      })
    },
    delNote(noteId) {
      noteServe.delNote(noteId).then((res) => {
        console.log(res)
      })
    },
    //根据不同类型路由获取不同信息
    async getData() {
      // this.$refs.scroll.defineFun((that) => {
      //   that.autoPullDownRefresh()
      // })
      this.noteDefaultPage = 1
      //路由调转获取指定的笔记
      let routeNoteId = this.$router.currentRoute.value.query.noteId
      //路由调转获取指定的笔记本
      let noteBookId = this.$router.currentRoute.value.query.noteBookId
      //路由调转获取指定的标签
      let signId = this.$router.currentRoute.value.query.signId
      if (routeNoteId) {
        await this.getNoteFromRoute(routeNoteId)
        return false
      } else if (noteBookId) {
        //  获取笔记本中的笔记
        await this.getNoteInNoteBook(noteBookId, 1)
        return false
      } else if (signId) {
        //获取标签中的笔记
        await this.getNoteInSign(signId, 1)
        return false
      }
      //获取默认笔记列
      await this.getNoteList(this.noteDefaultPage)
      // this.$refs.scroll.closePullDown()
    },
    //根据路由传递的noteId获取笔记
    getNoteFromRoute(id) {
      this.getNoteContent(id)
        .then((res) => {
          if (res.data.data) this.noteList.push(res.data.data)
        })
        .catch(() => {
          return (this.haveNote = false)
        })
    },
    //搜索笔记
    searchNote(searchValue, page = 1) {
      this.loadOption = 'search'
      let params = {}
      //换个关键字搜索 置空列表
      if (searchValue !== this.searchNoteKey) {
        this.noteList = []
      }
      page === 1 ? (this.noteDefaultPage = 1) : ''
      params.search = searchValue
      params.page = page
      noteServe.getDefaultNote(params).then((res) => {
        this.searchNoteKey = searchValue
        this.noteTotalPage = res.data.data.total_pages
        this.judgeData(res.data.data.list)
      })
    },
    //上拉加载
    pullUpLoad() {
      if (this.noteDefaultPage >= this.noteDefaultPage)
        return this.$baseFun.__message('已经到底啦~')
      this.noteDefaultPage += 1
      switch (this.loadOption) {
        case 'note':
          this.getNoteList(this.noteDefaultPage)
          break
        case 'search':
          this.searchNote(this.searchNoteKey, this.noteDefaultPage)
          break
        case 'noteBook':
          break
        case 'sign':
          break
      }
      this.$refs.scroll.closePullUp()
    },
    // 下拉刷新
    async pullDownRush() {
      this.loading = !this.loading
      this.noteDefaultPage = 1
      this.searchNoteKey = ''
      await this.getNoteList(1)
      //调用关闭下拉刷新动作
      this.$refs.scroll.closePullDown()
      this.loading = !this.loading
      this.$baseFun.__message('刷新成功', 'success')
    },
    //  点击了某个笔记
    onCheckNote(index) {
      this.isCheckNote = index
    },
    //  判断是否收藏
    isCollect(data) {
      if (data.collect) {
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
          if (!this.noteList[index].collect) {
            this.noteList[index].collect = true
            // 收藏
            this.collectNote(this.noteList[index].id)
          } else {
            this.noteList[index].collect = false
            // 取消收藏
            this.cancelCollect(this.noteList[index].id)
          }

          break
        case 2:
          this.$refs.delNote.open(index)
          break
      }
    },
    //  修改侧边栏笔记摘要 子组件修改了笔记内容或者名称时返回
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
    //  确定删除笔记
    definiteDeleteNote(index, option = true) {
      if (option) {
        this.$refs.delNote.close()
        this.delNote(this.noteList[index].id)
      }
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
        this.isCheckNote = this.isCheckNote - 1 < 0 ? 0 : this.isCheckNote - 1
      }
      this.noteList.length === 0 ? (this.haveNote = false) : ''
      setTimeout(() => {
        this.$refs.scroll.defineFun((that) => {
          that.refresh()
        })
      }, 500)
    },
    //将笔记移除列表，但后端不会删除
    moveNote(noteId) {
      this.noteList.forEach((item, index) => {
        if (item.id === noteId) this.definiteDeleteNote(index, false)
      })
    },
    //  判断获取的数据是否有值
    judgeData(data) {
      let content = []
      if (data.length > 0) {
        this.noteDefaultPage === 1 ? '' : (content = this.noteList)
        for (const item of data) {
          content.push(item)
        }
        this.noteList = content
        this.haveNote = true
      } else {
        this.haveNote = false
        this.noteList = []
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
  //transform: translateX(-80px);
}
.note-leave-active {
  transition: all 0.5s ease;
  position: absolute;
}
.note-move {
  transition: all 0.5s ease;
}
</style>
