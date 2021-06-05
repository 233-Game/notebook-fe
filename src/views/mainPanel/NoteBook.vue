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
      @searchNote="searchNote"
      @pullLoad="pullUpLoad"
      @pullRush="pullDownRush"
      v-if="bookList.length > 0"
      :loading="loading"
    >
      <template v-slot:scrollContent>
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
      </template>
    </scroll>
    <el-empty v-else description="点击右上角添加按钮，添加笔记本"></el-empty>
  </drawer>
</template>

<script>
import drawer from '@/components/basisModule/drawer'
import scroll from '@/components/basisModule/scroll'
import { getMap } from '../../../common/setStore'
import { __getNoteBookList } from '../../../common/commonFunction'
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
  },
  setup() {
    //  获取笔记本
    function getNoteBook(page) {
      __getNoteBookList(page).then((res) => {
        this.bookList = res.data.data.list
        // for (let noteBookElement of res.data.data.list) {
        //   this.noteBookList.push(noteBookElement)
        // }
      })
    }
    return {
      getNoteBook,
    }
  },
  data() {
    return {
      //笔记本列表
      bookList: [
        {
          id: '0',
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          id: '1',
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          id: '2',
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          id: '7',
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          id: '3',
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          id: '4',
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          id: '5',
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
        {
          id: '6',
          name: '初级',
          url: '/static/img/noteBook.png',
          desc: '这是一个简单的笔记本',
          time: '4-18',
        },
      ],
      //  选中笔记本的样式
      currentBook: this.$eNum.isCheckBookDefault,
      //  左侧右上角按钮集
      siderLeftIconBtn: ['#iconlajitong', '#iconadd-files'],
      //  下拉刷新的加载图标
      loading: false,
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
    //调用父组件事件，监听drawer关闭
    closeDrawer() {
      this.$parent.changSidBarClass(false, 'NoteBook')
    },
    //  选中笔记本，跳转到笔记页面
    toNote(info) {
      this.$router.push(
        `/index/Note?noteBookId=${info.id}&bookName=${info.name}`
      )
      this.closeDrawer()
    },
    //  删除笔记
    delBook(index) {
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
    searchNote(value) {
      console.log(value)
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
      let info = { id: -1, name: '回收站' }
      this.toNote(info)
    },
    //  添加笔记本
    addNoteBook() {
      console.log('添加笔记本')
    },
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
