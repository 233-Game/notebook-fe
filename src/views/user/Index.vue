<template>
  <div class="index">
    <side-bar
      ref="SideBarMethod"
      @setUsePanel="setUsePanel"
      @tapSideBar="tapSideBar"
    />
    <!--    个人信息-->
    <user-info-panel
      v-if="openPanel"
      class="userPanel"
      @closePanel="closePanel"
    />
    <!--    主题内容-->
    <div :style="cssVars" class="main">
      <router-view />
    </div>
    <div class="sideDrawer">
      <short-cut class="sideDrawer" :shortDrawer="shortDrawer"></short-cut>
      <note-book
        class="sideDrawer"
        :noteBookDrawer="noteBookDrawer"
      ></note-book>
      <sign class="sideDrawer" :signDrawer="signDrawer"></sign>
    </div>
  </div>
</template>
<script>
import UserInfoPanel from '@/components/panel/UserInfoPanel'
import SideBar from '../../components/panel/SideBar'
import { getMap } from '/common/setStore'
import ShortCut from '@/views/mainPanel/ShortCut'
import NoteBook from '@/views/mainPanel/NoteBook'
import Sign from '@/views/mainPanel/Sign'
export default {
  data() {
    return {
      //个人信息面板
      openPanel: false,
      token: false,
      //  快捷方式抽屉
      shortDrawer: false,
      //  笔记本抽屉
      noteBookDrawer: false,
      //  笔记本抽屉
      signDrawer: false,
      currentComponent: 'note',
    }
  },
  created() {
    this.token = this.$user.token
  },
  components: {
    SideBar,
    UserInfoPanel,
    ShortCut,
    NoteBook,
    Sign,
  },
  computed: {
    cssVars() {
      // 状态管理修改颜色==
      return {
        '--EditPanel': getMap('EditPanelColor'),
      }
    },
  },
  methods: {
    setUsePanel() {
      this.openPanel = true
    },
    closePanel() {
      this.openPanel = false
    },
    //  点击了tapSideBar
    tapSideBar(index) {
      let fullPath = this.$router.currentRoute.value.path
      this.$router.push(
        `${fullPath}?shortDrawer=${this.shortDrawer}&noteBookDrawer=${this.noteBookDrawer}&signDrawer=${this.signDrawer}`
      )
      switch (index) {
        //添加笔记
        case 0:
          this.noteBookDrawer = false
          this.signDrawer = false
          this.shortDrawer = false
          //路由跳转
          this.$router.push('/index/addNote')
          break
        //文件夹
        case 1:
          //关闭其他抽屉
          this.noteBookDrawer = false
          this.signDrawer = false
          this.shortDrawer = !this.shortDrawer
          this.changSidBarClass(this.shortDrawer)
          break
        //笔记
        case 2:
          this.noteBookDrawer = false
          this.signDrawer = false
          this.shortDrawer = false
          //路由跳转
          this.$router.push('/index/Note')
          break
        //笔记本
        case 3:
          //关闭其他抽屉
          this.noteBookDrawer = !this.noteBookDrawer

          this.signDrawer = false
          this.shortDrawer = false
          this.changSidBarClass(this.noteBookDrawer)
          break
        //标签
        case 4:
          //关闭其他抽屉
          this.noteBookDrawer = false
          this.signDrawer = !this.signDrawer
          this.shortDrawer = false
          this.changSidBarClass(this.signDrawer)
          break
      }
    },
    //  判断现在是哪个路由，修改SideBar组件中按钮的样式
    //el:哪个按钮
    changSidBarClass(el) {
      if (el === false) {
        let path = this.$router.currentRoute.value.name
        switch (path) {
          case 'Note':
            this.$refs.SideBarMethod.isCheck = 2
            break
          case 'addNote':
            this.$refs.SideBarMethod.isCheck = 0
            break
        }
        this.noteBookDrawer = false
        this.signDrawer = false
        this.shortDrawer = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.index {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.userPanel {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.main {
  flex: 1;
  width: 20vw;
  height: 100vh;
  background-color: var(--EditPanel);
}
.sideDrawer {
  position: absolute;
}
</style>
