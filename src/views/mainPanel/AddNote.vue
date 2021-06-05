<template>
  <div>
    <div class="V-Head flex_ACenter">
      <div>
        <!--      新增笔记模式下-->
        <input
          v-if="titleIsInput"
          class="titleInput font_size_18"
          type="text"
          v-model="title"
          maxlength="25"
          placeholder="请设置你的标题"
        />
        <!--      查看笔记模式下-->
        <el-tooltip
          v-else-if="headTitle"
          class="title font_size_18"
          :hide-after="0"
          effect="dark"
          content="修改笔记名称"
          placement="bottom"
        >
          <text @click="changeNoteName()" class="titleText">{{
            headTitle
          }}</text>
        </el-tooltip>
      </div>
      <div class="scrollBox">
        <el-tooltip
          :hide-after="0"
          effect="dark"
          content="移动笔记"
          placement="bottom"
        >
          <i class="el-icon-arrow-down icon" @click="choseNoteBook()"></i>
        </el-tooltip>
        <!--    移动笔记-->
        <Scroll
          ref="scroll"
          v-show="isMoveNote"
          class="moveNote"
          :loading="loading"
          :list="noteBookList"
          scroll-width="400px"
          scroll-height="600px"
          @pullLoad="pullLoad"
          @searchNote="searchNote"
          @checkNoteBook="checkNoteBook"
          @createNoteBook="createNoteBook"
        />
      </div>

      <!--      右侧功能键-->
      <div class="V-BtnAndSign flex_ACenter">
        <div class="btn">
          <slot>
            <el-tooltip
              :hide-after="0"
              effect="dark"
              content="收藏笔记"
              placement="bottom"
            >
              <i class="font_size_18" @click="isCollect = !isCollect">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="computedCollect"></use>
                </svg>
              </i>
            </el-tooltip>
          </slot>
          <el-popover
            ref="test"
            placement="bottom-start"
            :width="210"
            :hide-after="0"
            trigger="click"
            :show-arrow="false"
          >
            <template #reference>
              <i class="font_size_18">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon0-57"></use>
                </svg>
              </i>
            </template>
            <ul class="optionCard userSelect" :style="cssVar">
              <li
                class="optionLi"
                v-for="(li, indexLi) in signList"
                :key="indexLi"
                @click="choseSign(li.id)"
              >
                {{ li.desc }}
              </li>
            </ul>
          </el-popover>
          <el-button @click="submitBtn()" type="info">保存</el-button>
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
    <!--    修改笔记名弹出-->
    <Tip
      ref="changNoteName"
      tip-icon="#iconxiugaimingcheng"
      tip-title="修改笔记名"
      @definite="definiteChangeNote()"
    >
      <input
        v-model="title"
        placeholder="请输入文件夹名"
        maxlength="25"
        type="text"
        autofocus="autofocus"
        class="msgTip font_size_30"
      />
    </Tip>
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
  </div>
</template>

<script>
import vditor from 'vditor'
import Scroll from '@/components/basisModule/scroll'
import { __getNoteBookList } from '../../../common/commonFunction'
import { getMap } from '../../../common/setStore'
import noteServe from '@/api/noteApi'
import signServe from '@/api/signApi'
import Tip from '@/components/panel/Tip'
import noteBookServe from '@/api/noteBookApi'
let noteBookListPage = 1
export default {
  name: 'addNote',
  components: {
    Scroll,
    Tip,
  },
  props: {
    //是否是新增笔记
    titleIsInput: {
      type: Boolean,
      default: true,
    },
    //笔记id
    noteId: {
      default: -1,
      type: Number,
    },
  },
  data() {
    return {
      // 编辑器
      editor: null,
      //  笔记本列表
      noteBookList: [],
      loading: false,
      //  搜索关键字
      searchValue: '',
      //  点击移动笔记按钮
      isMoveNote: false,
      //input绑定
      title: '',
      //  收藏
      isCollect: false,
      //  标签列表
      signList: [
        { id: 0, desc: '啦啦啦啦' },
        { id: 1, desc: '啦啦啦啦' },
        { id: 2, desc: '啦啦啦啦' },
      ],
      //  创建笔记本名
      noteBookName: '',
      //笔记本总页数
      noteBookTotalPage: null,
      //  笔记名
      headTitle: '',
      //  该笔记绑定的笔记本
      noteBindNoteBookId: null,
    }
  },
  mounted() {
    //添加模式、编辑模式都使用到了title，因此创建时需要置空
    this.title = ''
    //初始化編輯器
    this.__initEdit()
    //  修改笔记模式下
    if (!this.titleIsInput) {
      this.getNote()
    }
    noteBookListPage = 1
    this.noteBookList = []
    this.getNoteBook(noteBookListPage)
  },
  watch: {
    //监听noteId的修改
    noteId(val) {
      if (val) {
        this.getNote()
      }
    },
  },
  computed: {
    //  收藏
    computedCollect() {
      if (this.isCollect) {
        return '#iconshoucang'
      } else {
        return '#iconshoucang1'
      }
    },
    cssVar() {
      //true 正常显示 false 特殊处理
      return {
        '--icon_font_bgc': getMap('IconFontBGC'),
        '--search_list_font_color': getMap('SearchListFontColor'),
      }
    },
  },
  setup() {
    // 创建笔记
    function createNote(params) {
      noteServe.createNote(params).then((res) => {
        this.$baseFun.__message('创建成功', 'success')
        this.$router.push(`/index/Note?noteId=${res.data.data}`)
      })
    }
    //保存笔记
    async function saveNote(id, params) {
      await noteServe.saveNote(id, params).then((res) => {
        this.$emit('changNote', res.data.data)
        this.headTitle = res.data.data.title
      })
      this.$baseFun.__closeLoading()
    }
    //移动至标记
    function bindSign(noteId, signId) {
      signServe.bindSign(noteId, signId).then(() => {
        this.$baseFun.__message('已添加到该标签', 'success')
      })
    }
    //创建笔记本
    function createBook(params) {
      return noteBookServe.createNoteBook(params).then((res) => res)
    }
    //获取具体的笔记
    function getNoteContent(noteId) {
      return noteServe.getNoteContent(noteId).then((res) => {
        return res
      })
    }
    //绑定笔记本
    function bindNoteBook(noteId, noteBookId) {
      noteBookServe.bindNoteBook(noteId, noteBookId).then((res) => {
        this.$baseFun.__closeLoading()
        if (res.data.code === 1) return this.$baseFun.__message('绑定失败')
        this.noteBindNoteBookId = noteBookId
      })
    }
    //  获取笔记本
    function getNoteBook(page) {
      __getNoteBookList(page).then((res) => {
        if (res.data.data.list) this.noteBookList = res.data.data.list
        // for (let noteBookElement of res.data.data.list) {
        //   this.noteBookList.push(noteBookElement)
        // }
      })
    }
    return {
      createNote,
      saveNote,
      bindSign,
      createBook,
      getNoteContent,
      bindNoteBook,
      getNoteBook,
    }
  },
  methods: {
    //初始化編輯器
    __initEdit() {
      this.editor = new vditor('vditor', {
        height: document.documentElement.clientHeight - 70,
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
        upload: {
          headers: {
            Authorization: this.$user.token,
          },
          url: '/upload/vditor',
        },
      })
    },
    //获取笔记
    async getNote() {
      this.$baseFun.__loading('加载中')
      await this.getNoteContent(this.noteId).then((res) => {
        this.headTitle = res.data.data.title
        this.editor.setValue(res.data.data.content)
        if (res.data.data.notebook)
          this.noteBindNoteBookId = res.data.data.notebook.id
        else this.noteBindNoteBookId = null
      })
      this.$baseFun.__closeLoading()
    },

    //创建、保存筆記
    submitBtn() {
      if (!this.title && this.titleIsInput) {
        return this.$baseFun.__message('为这个笔记取个名字吧~')
      }
      let note = this.editor.getValue()
      let params = {}
      params.title = this.title
      params.content = note
      if (!this.titleIsInput) {
        this.$baseFun.__loading('加载中')
        //  保存笔记
        this.saveNote(this.noteId, params)
      } else {
        //  创建笔记
        this.createNote(params)
      }
    },
    //  搜索
    searchNote(keyword) {
      this.searchValue = keyword
    },
    //上拉加载
    async pullLoad(that) {
      noteBookListPage += 1
      this.getNoteBook(noteBookListPage)
      await that.finishPullUp()
    },
    //点击移动笔记按钮
    choseNoteBook() {
      this.isMoveNote = !this.isMoveNote
      if (this.isMoveNote) {
        this.$refs.scroll.topNoteBook(this.noteBindNoteBookId)
      }
    },
    //  移动笔记本
    checkNoteBook(noteBookId) {
      this.$baseFun.__loading('绑定中...')
      this.bindNoteBook(this.noteId, noteBookId)
      this.isMoveNote = false
    },
    //  选中标签
    choseSign(signId) {
      this.$refs.test.hide()
      this.bindSign(this.noteId, signId)
    },
    //  修改笔记名称
    changeNoteName() {
      this.title = this.headTitle
      this.$refs.changNoteName.open()
    },
    //  确认修改笔记名称
    definiteChangeNote() {
      this.$refs.changNoteName.close()
      //保存名称
      this.submitBtn()
    },
    //  创建笔记本
    createNoteBook() {
      this.isMoveNote = false
      this.noteBookName = ''
      this.$refs.createNoteBook.open()
    },
    //  确认创建笔记本
    definiteCreateNoteBook() {
      this.$refs.createNoteBook.close()
      this.$baseFun.__loading('创建中...')
      let params = {}
      params.name = this.noteBookName
      this.createBook(params).then((res) => {
        let data = {}
        data.id = res.data.data
        data.name = this.noteBookName
        this.noteBookList.push(data)
        this.noteBookName = ''
        this.$baseFun.__closeLoading()
      })
    },
  },
}
</script>

<style lang="scss">
@import '~vditor/src/assets/scss/index';
.V-Head,
.V-BtnAndSign {
  position: relative;
  height: 70px;
  width: 100%;
  background-color: #f6f8fa;
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
.el-popover {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.titleInput,
.title {
  display: inline-block;
  height: 70px;
  border: none;
  outline: none;
  background: none;
  padding: 0 10px;
  text-align: center;
  font-weight: bold;
  min-width: 100px;
  max-width: 35vw;
  line-height: 70px;
  overflow: hidden;
}
.scrollBox {
  position: relative;
  top: 0;
}
.moveNote {
  position: absolute;
  top: 35px;
  left: -20px;
  width: 400px;
  background-color: #fff;
  z-index: 2101;
  border-radius: 5px;
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
}
</style>
