<template>
  <div class="index">
    <side-bar @setUsePanel="setUsePanel" />
    <!--    个人信息-->
    <user-info-panel
      v-if="openPanel"
      class="userPanel"
      @closePanel="closePanel"
    />
    <!--    主题内容-->
    <div :style="cssVars" class="main">
      <!--      <component></component>-->
    </div>
    <!--    遮罩-->
    <div v-if="openPanel" class="mask"></div>
  </div>
</template>
<script>
import UserInfoPanel from '@/components/panel/UserInfoPanel'
import { mapGetters } from 'vuex'
import SideBar from '../../components/panel/SideBar'

export default {
  data() {
    return {
      openPanel: false,
      token: false,
    }
  },
  created() {
    this.token = this.$user.token
  },
  components: {
    SideBar,
    UserInfoPanel,
  },
  computed: {
    ...mapGetters(['getTheme']),
    cssVars() {
      // 状态管理修改颜色==
      return {
        '--EditPanel': this.getTheme.EditPanelColor,
      }
    },
  },
  methods: {
    setUsePanel(info) {
      console.log(info)
      this.openPanel = true
    },
    closePanel() {
      this.openPanel = false
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../../static/style/setPanel';

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
  height: $panelHeight;
  width: $panelWidth;
  transform: translate(-50%, -50%);
  z-index: 99;
}

.mask {
  position: absolute;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 66;
}

.main {
  flex: 1;
  width: 20vw;
  height: 100vh;
  background-color: var(--EditPanel);
}
</style>
