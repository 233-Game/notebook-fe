<template>
  <div class="tip flex_JCenter" v-if="showTip" @click="showTip = false">
    <!--    内容-->
    <div class="content" @click.stop.prevent="">
      <!--      标题及图标-->
      <div class="title flex_column_ACenter">
        <svg class="icon tipIcon" aria-hidden="true">
          <use :xlink:href="tipIcon"></use>
        </svg>
        <p class="font_size">{{ tipTitle }}</p>
      </div>
      <slot></slot>
      <div class="btn flex_JCenter">
        <el-button
          class="cancel"
          type="info"
          @click.stop.prevent="showTip = false"
          >取消</el-button
        >
        <el-button
          class="definite"
          type="success"
          @click.stop.prevent="definite()"
          >{{ definiteValue }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tip',
  props: {
    //图标
    tipIcon: String,
    // 标题名
    tipTitle: String,
    //  确定按钮名
    definiteValue: {
      default: '确定',
      type: String,
    },
  },
  data() {
    return {
      //是否展现
      showTip: false,
      //  打开时父组件传过来的参数
      openParameter: null,
    }
  },
  methods: {
    //关闭tip
    close() {
      this.showTip = false
    },
    //打开tip
    open(parameter = null) {
      this.showTip = true
      if (parameter != null) this.openParameter = parameter
    },
    //确定
    definite() {
      this.$emit('definite', this.openParameter)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'static/style/base';
.tip {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 40;
  background-color: #fff;
}

.content {
  margin-top: calc(100vh * 0.4);
  transform: translateY(-20%);
  height: 100vh;
  padding: 0 40px;
}
.title {
  padding: 20px;
  .tipIcon,
  p {
    display: block;
    font-size: 30px;
    padding: 10px 0;
    text-align: center;
  }
  p {
    border-bottom: 1px solid #d9d9d9;
    padding: 20px;
  }
}
.btn {
  margin-top: 50px;
  .cancel,
  .definite {
    width: 48%;
  }
}
</style>
