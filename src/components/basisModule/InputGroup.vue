<template>
  <div>
    <div class="inputGroup">
      <label v-if="nav" :style="{ width: fontWidth + 'px' }">{{ nav }}</label>
      <!-- :value="value" @input="$emit('input',$event.target.value)" 实现父子组件数据双向绑定 -->
      <input
        :type="type"
        :placeholder="placeholder"
        :value="value"
        @input="$emit('input', $event.target.value)"
        :disabled="disabled"
        :class="[error ? 'is-invalid' : '', disabled ? 'disabledStyle' : '']"
        @blur="change"
        :maxlength="maxlength"
        :style="inputStyle"
      />
    </div>
    <p :style="{ marginLeft: fontWidth + 'px' }" v-if="error !== ''">
      {{ error }}
    </p>
  </div>
</template>
<script>
export default {
  name: 'InputGroup',
  props: {
    // input框绑定值
    // eslint-disable-next-line vue/require-prop-type-constructor
    value: '',
    // 错误信息
    error: String,
    // input框前的提示信息
    nav: String,
    placeholder: String,
    // 是否禁用
    disabled: Boolean,
    // 文本框类型
    type: {
      type: String,
      default: 'text',
    },
    //  文本字符长度
    maxlength: {
      type: String,
      default: '140',
    },
    inputStyle: String,
  },
  data() {
    return {
      fontWidth: 150,
    }
  },
  methods: {
    change() {
      this.$emit('blur')
    },
  },
}
</script>

<style scoped>
.inputGroup {
  margin: 25px 0 0 0;
  display: flex;
  width: 100%;
  align-items: flex-start;
}

.inputGroup label {
  line-height: 40px;
  font-size: 16px;
  text-align: right;
  font-weight: normal;
  padding-right: 20px;
}

.inputGroup input {
  flex: 1;
  height: 20px;
  width: 90%;
  border: 1px #dcdfe6 solid;
  border-radius: 20px;
  padding: 10px 20px;
  outline: none;
}

.is-invalid {
  border: 1px red solid !important;
}

p {
  position: absolute;
  margin-top: 5px;
  color: red;
  font-size: 14px;
}

.disabledStyle {
  background-color: #f5f7fa !important;
  cursor: not-allowed !important;
}
</style>
