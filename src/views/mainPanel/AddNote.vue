<template>
  <div>
    <div class="V-Head flex_ACenter">
      <!--      新增笔记模式下-->
      <input
        v-if="titleIsInput"
        class="titleInput"
        type="text"
        v-model="title"
        maxlength="30"
        placeholder="请设置你的标题吧"
      />
      <!--      查看笔记模式下-->
      <div v-else class="title">
        <el-tooltip
          :hide-after="0"
          effect="dark"
          content="前往笔记"
          placement="bottom"
        >
          <text class="titleText">{{ headTitle }}</text>
        </el-tooltip>
        <el-tooltip
          :hide-after="0"
          effect="dark"
          content="移动笔记"
          placement="bottom"
        >
          <i
            class="el-icon-arrow-down icon"
            @click="isMoveNote = !isMoveNote"
          ></i>
        </el-tooltip>
        <!--    移动笔记-->
        <Scroll
          v-if="isMoveNote"
          class="moveNote"
          :loading="loading"
          :list="arr"
          scroll-width="400px"
          scroll-height="600px"
          @pullLoad="pullLoad"
          @pullRush="pullRush"
          @searchNote="searchNote"
          @checkNoteBook="checkNoteBook"
        />
      </div>
      <!--      右侧功能键-->
      <div class="V-BtnAndSign flex_ACenter">
        <div class="btn">
          <slot></slot>
          <el-button @click="saveNote()" type="info">保存</el-button>
        </div>
      </div>
    </div>
    <div id="vditor"></div>
    <!--    遮罩-->
    <div
      v-show="isMoveNote"
      @click="isMoveNote = !isMoveNote"
      class="V-Mask"
    ></div>
  </div>
</template>

<script>
import vditor from 'vditor'
import Scroll from '@/components/basisModule/scroll'
let page = 1
export default {
  name: 'addNote',
  components: {
    Scroll,
  },
  props: {
    titleIsInput: {
      type: Boolean,
      default: true,
    },
    editContent: {
      type: String,
      default: '',
    },
    headTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      arr: [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
      contentEditor: null,
      //  笔记本列表
      noteBookList: [],
      loading: false,
      //  搜索关键字
      searchValue: '',
      //  点击移动笔记按钮
      isMoveNote: false,
      title: '',
    }
  },
  mounted() {
    //初始化編輯器
    this.__initEdit()
  },
  watch: {
    editContent(val) {
      if (val) this.__initEdit()
    },
  },
  methods: {
    //初始化編輯器
    __initEdit() {
      this.contentEditor = new vditor('vditor', {
        height: document.documentElement.clientHeight - 70,
        value: this.editContent,
        preview: {
          delay: 1000,
          show: true,
        },
        toolbarConfig: {
          pin: true,
        },
        cache: {
          enable: false,
        },
        resize: {
          enable: true,
        },
      })
    },
    //  获取笔记本
    getNoteBook() {
      let noteBook = this.$commonFun.__getNoteBook(this.searchValue, page)
      for (let noteBookElement of noteBook) {
        this.noteBookList.push(noteBookElement)
      }
    },
    //保存筆記
    saveNote() {
      let note = this.contentEditor.getValue()
      let translationNote = this.contentEditor.getHTML()
      console.log(note, translationNote)
    },
    //  搜索
    searchNote(keyword) {
      this.searchValue = keyword
    },
    //  下拉刷新
    async pullRush(that) {
      this.loading = true
      // //置空
      this.noteBookList = []
      page = 1
      this.getNoteBook()
      await that.finishPullDown()
      // this.loading = false
    },
    //上拉加载
    async pullLoad(that) {
      page += 1
      this.getNoteBook()
      await that.finishPullUp()
    },
    //  移动笔记本
    checkNoteBook(noteBookId) {
      console.log(noteBookId)
      //  获取笔记本
      // this.getNoteBook()
    },
  },
}
</script>

<style lang="scss">
@import '~vditor/src/assets/scss/index';
.V-Head,
.V-BtnAndSign {
  height: 70px;
  width: 100%;
  background-color: #f6f8fa;
  .titleInput,
  .title {
    position: relative;
    display: inline-block;
    border: none;
    width: 50%;
    height: 70px;
    outline: none;
    background-color: #f6f8fa;
    line-height: 70px;
    padding: 0 40px;
    font-size: 18px;
    font-weight: bold;
    .moveNote {
      position: relative;
      width: 400px;
      background-color: #fff;
      z-index: 2101;
      border-radius: 5px;
    }
  }
  .titleText {
    cursor: pointer;
    outline: none;
  }
  .icon {
    padding: 0 10px;
    vertical-align: middle;
    cursor: pointer;
    outline: none;
  }
}
.V-BtnAndSign {
  position: relative;
  .btn {
    position: absolute;
    right: 30px;
  }
}
.V-MoveNote {
  position: absolute;
  top: 50px;
  width: 400px;
  max-height: 600px;
  background-color: #fff;
  //box-shadow: 0 0 10px 3px rgba(#cccccc, 0.6);
  border-radius: 5px;
  overflow: hidden;
}
.V-Mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2100;
}
</style>
