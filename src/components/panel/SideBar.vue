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
        <img :src="userInfo.avatar" alt="" />
      </div>
    </div>

    <!-- 主要功能 -->
    <div class="mainFunction flex_column_ACenter">
      <el-row class="flex_column_ACenter">
        <el-tooltip
          :hide-after="0"
          class="item"
          effect="dark"
          content="新建笔记"
          placement="right"
        >
          <el-button
            class="elBtn"
            icon="el-icon-plus"
            circle
            :class="isCheck === 0 ? 'isCheckBtn' : ''"
            @click="checkBtn(0)"
          ></el-button>
        </el-tooltip>
      </el-row>
    </div>
    <!-- 辅助功能 -->
    <div class="mainFunction flex_column_ACenter">
      <el-row class="flex_column_ACenter" style="fontsize: 30px">
        <el-tooltip
          :hide-after="0"
          class="item"
          effect="dark"
          content="文件夹"
          placement="right"
        >
          <el-button
            class="elBtn"
            icon="el-icon-folder-opened"
            circle
            :class="isCheck === 1 ? 'isCheckBtn' : ''"
            @click="checkBtn(1)"
          ></el-button>
        </el-tooltip>

        <el-tooltip
          :hide-after="0"
          class="item"
          effect="dark"
          content="笔记"
          placement="right"
        >
          <el-button
            class="elBtn"
            icon="el-icon-document"
            circle
            :class="isCheck === 2 ? 'isCheckBtn' : ''"
            @click="checkBtn(2)"
          ></el-button>
        </el-tooltip>

        <el-tooltip
          :hide-after="0"
          class="item"
          effect="dark"
          content="笔记本"
          placement="right"
        >
          <el-button
            class="elBtn"
            icon="el-icon-reading"
            circle
            :class="isCheck === 3 ? 'isCheckBtn' : ''"
            @click="checkBtn(3)"
          ></el-button>
        </el-tooltip>

        <el-tooltip
          :hide-after="0"
          class="item"
          effect="dark"
          content="标签"
          placement="right"
        >
          <el-button
            class="elBtn"
            icon="el-icon-discount"
            circle
            :class="isCheck === 4 ? 'isCheckBtn' : ''"
            @click="checkBtn(4)"
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
      isCheck: 2,
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
      this.isCheck = index
      this.$emit('tapSideBar', index)
    },
  },
  setup() {
    const userInfo = reactive({
      userInfo: {},
    })

    //  获取用户信息
    function getUserInfo() {
      if (this.$user.token) {
        this.userInfo = this.$user.userInfo
      }
    }

    return {
      userInfo,
      getUserInfo,
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
