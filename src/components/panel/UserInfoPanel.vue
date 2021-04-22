<template>
  <div class="panel_U flex_JCenter" :style="cssVars">
    <div class="side_U">
      <el-radio-group
        v-model="radio"
        :fill="BtnFillColor"
        :text-color="BtnFontColor"
      >
        <el-radio-button
          @change="componentsSkip('Account')"
          :border="false"
          class="allItem_U btnItem_U"
          label="账户信息"
        ></el-radio-button>
        <el-radio-button
          @change="componentsSkip('AccountSafe')"
          :border="false"
          class="btnItem_U"
          label="账户安全"
        ></el-radio-button>
        <el-radio-button
          @change="componentsSkip('Set')"
          :border="false"
          class="btnItem_U"
          label="设置"
        ></el-radio-button>
        <el-radio-button
          @change="componentsSkip('ImportAndExport')"
          :border="false"
          class="allItem_U btnItem_U"
          label="导入导出"
        ></el-radio-button>
        <el-radio-button
          @change="componentsSkip('Help')"
          :border="false"
          class="btnItem_U"
          label="帮助"
        ></el-radio-button>
      </el-radio-group>
    </div>
    <div class="main_U">
      <component :is="currentComponent"></component>
    </div>
    <span @click="closePanel" class="closeIcon_U">
      <i class="el-icon-close"></i>
    </span>
  </div>
</template>

<script>
import { reactive } from 'vue'
import Account from '@/views/setInfo/Account'
import AccountSafe from '@/views/setInfo/accountSafe/AccountSafe'
import Help from '@/views/setInfo/Help'
import Set from '@/views/setInfo/Set'
import ImportAndExport from '@/views/setInfo/ImportAndExport'
import { getMap } from '../../../common/setStore'

export default {
  name: 'UserInfoPanel',
  data() {
    return {
      //  动态切换路由
      currentComponent: 'Account',
      //  按钮
      radio: '账户信息',
    }
  },
  components: {
    Account,
    AccountSafe,
    Help,
    Set,
    ImportAndExport,
  },
  computed: {
    cssVars() {
      const windowWidth = document.body.clientWidth
      if (windowWidth <= 1250)
        return { '--varWidth': '65vw', '--theme_color': getMap('ThemeColor') }
      else if (windowWidth <= 1500)
        return { '--varWidth': '55vw', '--theme_color': getMap('ThemeColor') }
      else
        return { '--varWidth': '40vw', '--theme_color': getMap('ThemeColor') }
    },
    BtnFillColor() {
      return getMap('BtnFillColor')
    },
    BtnFontColor() {
      return getMap('BtnFontColor')
    },
  },
  setup() {
    const userInfo = reactive({
      userInfo: {},
    })

    //  获取用户信息
    function getUserInfo() {
      if (this.$user.userInfo != null) {
        this.userInfo = this.$user.userInfo
      }
    }

    return {
      userInfo,
      getUserInfo,
    }
  },
  created() {
    //  获取用户信息
    this.getUserInfo()
  },
  methods: {
    // 设置页路由重定向
    componentsSkip(info) {
      console.log(info)
      this.currentComponent = info
    },
    //  关闭弹窗
    closePanel() {
      this.$emit('closePanel')
    },
  },
}
</script>
<style lang="scss">
@import '../../../static/style/base';

.panel_U {
  width: var(--varWidth);
  height: 50vh;
  box-shadow: 0 0 20px 3px rgba(0, 0, 0, 0.1);
}

.side_U {
  position: relative;
  width: 150px;
  height: calc(100% - 60px);
  padding: 30px 0;
  background-color: #fff;
}

.main_U {
  flex: 1;
  width: 100px;
  height: calc(100% - 66px);
  padding: 33px 30px;
  background-color: var(--theme_color);
}

.allItem_U {
  width: 100%;
  margin: 20px 0 0 0;
}

.btnItem_U {
  width: 100%;

  span {
    width: 100%;
    outline: none;
    border: none !important;
  }
}

.closeIcon_U {
  position: fixed;
  top: 15px;
  right: 15px;
  border: none;
  font-size: 20px;
  background: none;
  color: #999999;
  cursor: pointer;
}
</style>
