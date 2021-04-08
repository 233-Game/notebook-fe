<template>
  <div class="step">
    <div
      v-for="(item, index) in stepItem"
      :key="index"
      :class="{ active: isActive === item.id }"
      class="flex_JCenter stepItem"
    >
      <!--  描述-->
      <div class="describe">
        <span @click="toSetComponents(item.id)">{{ item.desc }}</span>
      </div>
      <!--  线-->
      <div class="flex_column_ACenter linnAndCircle">
        <!--    原点按钮-->
        <div @click="toSetComponents(item.id)" class="circle"></div>
        <!--    线-->
        <div
          v-if="index !== stepItem.length - 1"
          class="line"
          :style="{ height: stepHeight }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step',
  props: {
    stepHeight: {
      default: '130px',
      type: String,
    },
    // 步骤
    stepItem: Array,
  },
  data() {
    return {
      isActive: 'setPassword',
    }
  },
  methods: {
    toSetComponents(info) {
      this.isActive = info
      this.$emit('toSetComponents', info)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../static/style/base';

.circle {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: #e2e2e2;
}

.stepItem {
  position: relative;
}

.step {
  height: 100%;
  width: 100%;
}

.line {
  width: 1px;
  background-color: #e2e2e2;
}

.active {
  span {
    color: #5576bd;
  }

  .circle {
    background-color: #5576bd;
  }
}

.linnAndCircle {
  position: relative;
  left: 10%;
}

.describe {
  position: absolute;
  top: -5px;
  left: -10px;
  width: 60px;
  font-size: 12px;
  line-height: 20px;

  span {
    cursor: pointer;
  }
}
</style>
