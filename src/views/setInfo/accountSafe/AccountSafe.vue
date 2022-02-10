<template>
  <div class="accountSafe">
    <!--    侧边按钮-->
    <div class="sideStep">
      <Step @toSetComponents="toSetComponents" :stepItem="stepItem" />
    </div>
    <!--    主要修改项-->
    <div class="main">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import Step from '@/components/basisModule/Step'
import setMobile from '@/views/setInfo/accountSafe/SetMobile'
import setPassword from '@/views/setInfo/accountSafe/SetPassword'

export default {
  name: 'AccountSafe',
  data() {
    return {
      stepItem: [
        { id: 'setPassword', desc: '设置密码' },
        { id: 'setMobile', desc: '设置手机号' },
      ],
      currentComponent: 'setPassword',
    }
  },
  components: {
    Step,
    setPassword,
    setMobile,
  },
  methods: {
    toSetComponents(info) {
      this.currentComponent = info
    },
  },
}
</script>

<style lang="scss" scoped>
.accountSafe {
  display: flex;
  width: 100%;
  height: 100%;
}

.sideStep {
  float: left;
  left: 0;
  width: 20%;
  height: 100%;
}

.main {
  flex: 1;
  height: 100%;
  margin-left: 10px;
}
</style>
