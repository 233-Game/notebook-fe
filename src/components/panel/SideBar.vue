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
          <el-button class="elBtn" icon="el-icon-plus" circle></el-button>
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
          content="快捷方式"
          placement="right"
        >
          <el-button
            class="elBtn"
            icon="el-icon-folder-opened"
            circle
          ></el-button>
        </el-tooltip>

        <el-tooltip
          :hide-after="0"
          class="item"
          effect="dark"
          content="笔记"
          placement="right"
        >
          <el-button class="elBtn" icon="el-icon-document" circle></el-button>
        </el-tooltip>

        <el-tooltip
          :hide-after="0"
          class="item"
          effect="dark"
          content="笔记本"
          placement="right"
        >
          <el-button class="elBtn" icon="el-icon-reading" circle></el-button>
        </el-tooltip>

        <el-tooltip
          :hide-after="0"
          class="item"
          effect="dark"
          content="标签"
          placement="right"
        >
          <el-button class="elBtn" icon="el-icon-discount" circle></el-button>
        </el-tooltip>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { reactive } from 'vue'

export default {
  name: 'SideBar',
  data() {
    return {}
  },
  created() {
    //  获取用户信息
    this.getUserInfo()
  },
  computed: {
    ...mapGetters(['getTheme']),
    cssVars() {
      // 状态管理修改颜色==
      return {
        '--font_color': this.getTheme.IconFontColor,
        '--theme_color': this.getTheme.ThemeColor,
      }
    },
  },
  methods: {
    setUser() {
      this.$emit('setUsePanel')
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
<style lang="scss" scoped>
@import '../../../static/style/base';

.SideBar {
  top: 0;
  left: 0;
  width: 100px;
  height: calc(100vh - 10px);
  background-color: var(--theme_color);
  padding-top: 15px;
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
}
</style>
