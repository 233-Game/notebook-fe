<template>
  <div>
    <drawer
      ref="drawer"
      :drawer="signDrawer"
      @closeDrawer="closeDrawer"
      head-title="标签"
      :right-btn="sideIcon"
      @iconOperate="addSign"
    >
      <!--    滑动列表-->
      <Scroll
        ref="scroll"
        class="better-scroll"
        scroll-height="calc(100vh - 70px)"
        @pullLoad="pullUpLoad"
        @pullRush="pullDownRush"
        :loading="noteLoading"
      >
        <template v-slot:searchInput>
          <div class="tag-box">
            <el-tag
              v-for="item in signList"
              :key="item.id"
              class="tag-item"
              size="medium"
              :type="currentSign.id === item.id ? 'danger' : 'success'"
              :title="item.desc"
              @click="selectSign(item)"
              @dblclick="changeSign(item)"
              @close="delSign(item)"
              closable
            >
              {{ item.name }}
            </el-tag>
          </div>
        </template>
        <template v-slot:scrollContent>
          <note-list
            :total="noteTotal"
            :note-list="noteList"
            @select="selectNote"
            @delete="deleteSource"
          ></note-list>
        </template>
      </Scroll>
    </drawer>
    <!--    删除标签-->
    <tip
      ref="delSign"
      tip-icon="#iconsousuo_lajitong"
      tip-title="删除标签"
      @definite="definiteDelete"
    >
      <div class="font_size_30 msgTip">
        确定删除{{ delSignData.name }}该标签吗?
      </div>
    </tip>
    <!--    添加标签-->
    <tip
      ref="addSign"
      tip-icon="#icontianjiabiaoqian"
      tip-title="添加标签"
      @definite="addSignDefinite"
    >
      <input
        v-model="addSignName"
        placeholder="请输入标签名"
        maxlength="10"
        type="text"
        autofocus="autofocus"
        class="msgTip font_size_30"
      />
    </tip>
    <tip
      ref="changeSign"
      tip-icon="#icontianjiabiaoqian"
      tip-title="修改标签"
      @definite="changeSignDefinite"
    >
      <input
        v-model="currentSign.name"
        placeholder="请输入标签名"
        maxlength="10"
        type="text"
        autofocus="autofocus"
        class="msgTip font_size_30"
      />
    </tip>
    <Tip
      ref="unbindNote"
      tip-icon="#iconsousuo_lajitong"
      tip-title="解绑笔记"
      @definite="unbindNote"
    >
      <div class="font_size_30 msgTip">确定解绑该笔记吗?</div>
    </Tip>
  </div>
</template>

<script>
import drawer from '@/components/basisModule/drawer'
import Scroll from '@/components/basisModule/scroll'
import Tip from '@/components/panel/Tip'
import signServe from '@/api/signApi'
import NoteList from '@/components/common/NoteList'

export default {
  name: 'sign',
  props: {
    signDrawer: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    drawer,
    Scroll,
    Tip,
    NoteList,
  },
  data() {
    return {
      sideIcon: ['#icontianjiabiaoqian'],
      //  标签列表
      signList: [],
      addSignName: '',
      delSignData: {},
      currentSign: {},
      page: 1,
      noteList: [],
      noteTotal: 0,
      noteLoading: false,
    }
  },
  setup() {
    function getSignList() {
      signServe.getList().then((res) => {
        let list = res.data.data
        this.currentSign = list.length ? list[0] : {}
        this.signList = list
      })
    }

    return {
      getSignList,
    }
  },
  methods: {
    //调用父组件事件，监听drawer关闭
    closeDrawer() {
      this.$parent.changSidBarClass(false, 'Sign')
    },
    //  刷新scroll
    computedScroll() {
      //点击展页时有动画存在，因此需要给动画完成时间再重新计算scroll高度
      setTimeout(() => {
        this.$refs.scroll.defineFun((that) => {
          that.refresh()
        })
      }, 300)
    },
    //  添加标签
    addSign() {
      this.$refs.addSign.open()
    },
    //删除标签
    delSign(data) {
      this.delSignData = data
      this.$refs.delSign.open()
    },
    changeSign() {
      this.$refs.changeSign.open()
    },
    //确定删除标签
    definiteDelete() {
      if (Object.keys(this.delSignData).length) {
        signServe.delete(this.delSignData.id).then((res) => {
          if (res.code) {
            return this.$baseFun.__message(res.message)
          }
          this.delSignData = {}
          this.$refs.delSign.close()
          this.getSignList()
          this.$baseFun.__message(res.message, 'success')
        })
      }
    },
    //确定添加标签
    addSignDefinite() {
      signServe.creatSign(this.addSignName).then((res) => {
        if (res.code) {
          return this.$baseFun.__message(res.message)
        }
        this.addSignName = ''
        this.$baseFun.__message(res.message, 'success')
        this.$refs.addSign.close()
        this.getSignList()
      })
    },
    selectSign(data) {
      if (data !== this.currentSign) {
        this.currentSign = data
      }
    },
    changeSignDefinite() {
      signServe.update(this.currentSign).then((res) => {
        if (res.code) {
          return this.$baseFun.__message(res.message)
        }
        this.$baseFun.__message(res.message, 'success')
        this.$refs.changeSign.close()
        this.getSignList()
      })
    },
    getTagNotes() {
      this.noteLoading = true
      signServe.showNotes(this.currentSign.id, this.currentPage).then((res) => {
        if (!res.code) {
          this.noteList.push(...res.data.list)
          this.noteTotal = res.data.total
          this.noteLoading = false
          return
        }
        this.$baseFun.__message(res.message)
      })
    },
    selectNote(data) {
      console.log('----', data)
      this.$router.push(
        `/index/note?signId=${this.currentSign.id}&name=${this.currentSign.name}`
      )
      this.$refs.drawer.closeDrawer()
    },
    pullDownRush() {
      setTimeout(() => {
        this.$refs.scroll.closePullUp()
      }, 1000)
    },
    pullUpLoad() {
      this.loading = !this.loading
      setTimeout(() => {
        //调用关闭下拉刷新动作
        if (this.haveNote) {
          this.page++
          this.getTagNotes()
        } else {
          console.log('max')
          this.$refs.scroll.closePullDown()
        }
        this.loading = !this.loading
      }, 1000)
    },
    deleteSource(index) {
      this.$refs.unbindNote.open(index)
    },
    unbindNote(index) {
      signServe
        .unbind(this.currentSign.id, this.noteList[index].id)
        .then((res) => {
          if (res.code) {
            this.$baseFun.__message(res.code)
            return
          }
          this.noteList.splice(index, 1)
          this.$refs.unbindNote.close()
        })
    },
  },
  watch: {
    signDrawer(value) {
      if (value) {
        this.getSignList()
      }
    },
    currentSign(val) {
      if (val.id) {
        this.currentPage = 1
        this.noteList = []
        this.noteTotal = 0
        this.getTagNotes()
      }
    },
  },
  computed: {
    haveNote() {
      return this.noteList.length < this.noteTotal
    },
  },
  created() {},
}
</script>

<style scoped lang="scss">
@import '../../../static/style/base';

.msgTip {
  display: block;
  padding: 20px 40px;
  border: none;
  outline: none;
  text-align: center;
}

.tag-box {
  padding: 10px;

  .tag-item {
    margin: 5px;

    .selected {
      color: #2cbd5f;
    }
  }
}
</style>
