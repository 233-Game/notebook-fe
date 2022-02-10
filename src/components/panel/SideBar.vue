// 侧边栏
<template>
  <div class="SideBar flex_column_ACenter" :style="cssVars">
    <div style="cursor: pointer" @click="setUser">
      <!-- 默认头像 -->
      <el-avatar
        v-if="!userInfo.avatar"
        :size="45"
        style="fontsize: 30px"
        icon="el-icon-user-solid"
      ></el-avatar>

      <!-- 自定义头像 -->
      <div v-else class="photo">
        <img :src="webUrl + userInfo.avatar" alt="" />
      </div>
    </div>

    <!-- 功能按键 -->
    <div class="mainFunction">
      <el-row v-for="(btn, index) in sideBarList" :key="index">
        <el-tooltip
          :hide-after="0"
          class="item"
          effect="dark"
          :content="btn.tipMsg"
          placement="right"
        >
          <el-button
            class="elBtn"
            :icon="btn.icon"
            circle
            :class="currentBtnIndex === index ? 'isCheckBtn' : ''"
            @click="checkBtn(index)"
            @dblclick="dbTap(index)"
          ></el-button>
        </el-tooltip>
      </el-row>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
import { getMap } from '../../../common/setStore'

export default {
  name: 'SideBar',
  data() {
    return {
      currentBtnIndex: this.$eNum.sideBtnDefault,
      //网络根路径
      webUrl: process.env.VUE_APP_PROXY_PATH,
    }
  },
  created() {
    //  获取用户信息
    this.getUserInfo()
  },
  computed: {
    cssVars() {
      // 状态管理修改颜色==
      return {
        '--font_color': getMap('IconFontColor'),
        '--theme_color': getMap('ThemeColor'),
        '--icon_font_bgc': getMap('IconFontBGC'),
        '--icon_border_color': getMap('IconBorderColor'),
      }
    },
  },
  methods: {
    setUser() {
      this.$emit('setUsePanel')
    },
    checkBtn(index) {
      this.currentBtnIndex = index
      this.$emit('tapSideBar', index)
    },
    //  双击事件
    dbTap(index) {
      if (index === 2) {
        this.$config.noteReload.reload()
      }
    },
  },
  setup() {
    const userInfo = reactive({
      userInfo: {},
    })
    //左边功能按钮集
    const sideBarList = reactive([
      { tipMsg: '新建笔记', icon: 'el-icon-plus' },
      { tipMsg: '文件夹', icon: 'el-icon-folder-opened' },
      { tipMsg: '笔记', icon: 'el-icon-document' },
      { tipMsg: '笔记本', icon: 'el-icon-reading' },
      { tipMsg: '标签', icon: 'el-icon-discount' },
    ])

    //  获取用户信息
    function getUserInfo() {
      if (this.$user.token) {
        this.userInfo = this.$user.userInfo
      }
    }

    return {
      userInfo,
      getUserInfo,
      sideBarList,
    }
  },
}
</script>
<style scoped lang="scss">
@import '../../../static/style/base';

.SideBar {
  top: 0;
  left: 0;
  width: 100px;
  height: calc(100vh - 10px);
  background-color: var(--theme_color);
  padding-top: 15px;
  z-index: 35;
}
// 自定义头像
.photo {
  width: 45px;
  height: 45px;
  border-radius: 45px;
  overflow: hidden;

  img {
    width: 45px;
    height: 45px;
  }
}

// 主要功能
.mainFunction {
  margin-top: 50px;
  .el-row:first-child {
    margin-bottom: 50px;
  }
  .elBtn {
    margin: 10px 0;
    font-size: 19px;
    color: var(--font_color);
  }
  .elBtn:hover {
    background-color: var(--icon_font_bgc);
    border-color: var(--icon_border_color);
  }
  .isCheckBtn {
    background-color: var(--icon_font_bgc) !important;
    border-color: var(--icon_border_color) !important;
  }
  .el-button:focus {
    border-color: #dfe1e8;
    background-color: #ffffff;
  }
}
</style>
