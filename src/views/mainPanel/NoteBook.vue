<template>
  <drawer
    :drawer="noteBookDrawer"
    @closeDrawer="closeDrawer"
    head-title="笔记本"
    :list-num="'（' + bookList.length + ' 本笔记本）'"
    :right-btn="siderLeftIconBtn"
    @iconOperate="iconOperate"
  >
    <!--      滑动列表-->
    <scroll
      ref="scroll"
      class="better-scroll"
      scroll-height="calc(100vh - 130px)"
      :style="cssVar"
      @searchNote="searchNoteBook"
      @pullLoad="pullUpLoad"
      @pullRush="pullDownRush"
      :loading="loading"
    >
      <template v-slot:scrollContent>
        <div v-if="haveBook">
          <transition-group name="noteBook">
            <div
              class="book_list flex_ACenter"
              v-for="(item, index) in bookList"
              :key="item.id"
              @click="toNote(item)"
            >
              <el-image class="displayImage" :src="item.cover" fit="cover" />
              <div class="rightItem">
                <span class="name font_size_18">{{ item.name }}</span>
                <span class="desc color_87">{{ item.desc }}</span>
                <span class="time font_size">{{ item.updated_at }}</span>
              </div>
              <div
                class="delBook flex_ACenter_Jcenter"
                @click.stop.prevent="delBook(index)"
              >
                <svg class="icon delBookIcon" aria-hidden="true">
                  <use xlink:href="#iconlajilou"></use>
                </svg>
              </div>
            </div>
          </transition-group>
        </div>
        <el-empty
          v-else
          description="点击右上角添加按钮，添加笔记本"
        ></el-empty>
      </template>
    </scroll>

    <!--    创建笔记本弹出-->
    <Tip
      ref="createNoteBook"
      tip-icon="#iconbijiben"
      tip-title="创建笔记本"
      @definite="definiteCreateNoteBook()"
    >
      <input
        v-model="noteBookName"
        placeholder="请输入笔记本名"
        maxlength="25"
        type="text"
        autofocus="autofocus"
        class="msgTip font_size_30"
      />
    </Tip>
    <Tip
      ref="delNoteBook"
      tip-icon="#iconsousuo_lajitong"
      tip-title="删除笔记本"
      @definite="definiteDeleteNoteBook"
    >
      <div class="font_size_30 msgTip">确定删除该笔记本吗?</div>
    </Tip>
  </drawer>
</template>

<script>
import drawer from '@/components/basisModule/drawer'
import scroll from '@/components/basisModule/scroll'
import { getMap } from '../../../common/setStore'
import { __getNoteBookList } from '../../../common/commonFunction'
import noteBookServe from '@/api/noteBookApi'
import Tip from '@/components/panel/Tip'
let delBookClock = 1
export default {
  name: 'NoteBook',
  props: {
    noteBookDrawer: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    drawer,
    scroll,
    Tip,
  },
  setup() {
    //  获取笔记本
    function getNoteBook(page) {
      this.searchValue = ''
      __getNoteBookList(page).then((res) => {
        this.totalPage = res.data.data.total_pages
        this.judgeData(res.data.data.list)
      })
    }
    //创建笔记本
    function createBook(params) {
      return noteBookServe.createNoteBook(params).then((res) => res)
    }
    //搜索笔记本
    function searchBook(key, page) {
      let params = {}
      params.search = key
      params.page = page
      noteBookServe.getNoteBook(params).then((res) => {
        this.totalPage = res.data.total_pages
        this.judgeData(res.data.data.list)
      })
    }
    //删除笔记本
    // function delNoteBook(noteBookId) {
    //   noteBookServe.delNoteBook(noteBookId)
    // }
    return {
      getNoteBook,
      createBook,
      searchBook,
    }
  },
  data() {
    return {
      //笔记本列表
      bookList: [],
      //  选中笔记本的样式
      currentBook: this.$eNum.isCheckBookDefault,
      //  左侧右上角按钮集
      siderLeftIconBtn: ['#iconlajitong', '#iconadd-files'],
      //  下拉刷新的加载图标
      loading: false,
      //  创建笔记的名称
      noteBookName: '',
      //默认page
      defaultPage: 1,
      //  总page
      totalPage: 1,
      //  是否有笔记本
      haveBook: true,
      //  搜索内容
      searchValue: '',
    }
  },
  created() {
    this.getNoteBook()
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
    delNoteBook(noteBookId) {
      noteBookServe.delNoteBook(noteBookId)
    },
    //调用父组件事件，监听drawer关闭
    closeDrawer() {
      this.$parent.changSidBarClass(false, 'NoteBook')
    },
    //  选中笔记本，跳转到笔记页面
    toNote(info) {
      this.$router.push(`/index/Note?noteBookId=${info.id}&name=${info.name}`)
      this.closeDrawer()
    },
    //  删除笔记本
    delBook(index) {
      this.$refs.delNoteBook.open(index)
    },
    async definiteDeleteNoteBook(index) {
      await this.delNoteBook(this.bookList[index].id)
      this.$refs.delNoteBook.close()
      //设置锁，避免快速删除，引起bug
      if (delBookClock === 1) {
        delBookClock = 0
        this.bookList.splice(index, 1)
        //重新计算scroll,定时时间最好更移出动画时间同步
        setTimeout(() => {
          //释放锁
          delBookClock = 1
          this.$refs.scroll.defineFun((that) => {
            that.refresh()
          })
        }, 500)
      }
    },
    //搜索笔记本
    searchNoteBook(value) {
      if (value !== this.searchValue) this.bookList = []
      this.defaultPage = 1
      this.searchBook(value, 1)
    },
    //  右上角图标按钮
    iconOperate(index) {
      switch (index) {
        //回收站
        case 0:
          this.recycle()
          break
        //添加笔记本
        case 1:
          this.addNoteBook()
          break
      }
    },
    //  回收站
    recycle() {
      let info = { id: 0, name: '回收站' }
      this.toNote(info)
    },
    //  添加笔记本
    addNoteBook() {
      this.$refs.createNoteBook.open()
    },
    //确认创建笔记本
    definiteCreateNoteBook() {
      let params = {}
      params.name = this.noteBookName
      this.$refs.createNoteBook.close()
      this.$baseFun.__loading('创建中...')
      this.createBook(params).then((res) => {
        this.bookList.push(res.data.data)
        this.noteBookName = ''
        this.$baseFun.__closeLoading()
      })
    },
    //上拉加载
    pullUpLoad() {
      if (this.defaultPage >= this.totalPage)
        return this.$baseFun.__message('已经到底啦~')
      this.defaultPage += 1
      if (this.searchValue) {
        this.searchBook(this.searchValue, this.defaultPage)
      } else {
        this.getNoteBook(this.defaultPage)
      }
    },
    // 下拉刷新
    async pullDownRush() {
      this.loading = true
      this.defaultPage = 1
      await this.getNoteBook(1)
      this.$refs.scroll.closePullDown()
      this.loading = false
      this.$baseFun.__message('刷新成功', 'success')
    },
    //  判断获取的数据是否有值
    judgeData(data) {
      let content = []
      if (data.length > 0) {
        this.defaultPage === 1 ? '' : (content = this.bookList)
        for (const item of data) {
          content.push(item)
        }
        this.bookList = content
        this.haveBook = true
      } else {
        this.haveBook = false
        this.noteList = []
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'static/style/base.scss';

.book_list {
  position: relative;
  width: calc(100% - 20px);
  height: 150px;
  box-sizing: border-box;
  margin: 0 10px;
  padding: 0 10px;
  border-bottom: 1px solid #ececec;

  .displayImage {
    width: 110px;
    height: 110px;
    margin-right: 20px;
  }

  .rightItem {
    position: relative;
    width: 100px;
    height: 110px;
    flex: 1;
    cursor: pointer;

    span {
      display: block;
    }

    .desc {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .time {
    display: inline-block;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}

.delBook {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40%;
  background-color: var(--icon_font_bgc);
  color: var(--search_list_font_color);
  font-size: 20px;
  visibility: hidden;
  cursor: pointer;
}
.book_list:hover .delBook {
  visibility: visible;
}
</style>
<style lang="scss">
.noteBook-leave-to {
  opacity: 0;
  transition: all 0.5s ease;
}
.noteBook-leave-active {
  transition: all 0.5s ease;
  position: absolute !important;
}
.noteBook-move {
  transition: all 0.5s ease;
}
</style>
