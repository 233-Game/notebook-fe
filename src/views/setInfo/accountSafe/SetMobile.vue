<template>
  <div>
    <div v-if="userInfo.phone">
      <span class="font_size passwordSpan">已绑定 {{ userInfo.phone }}</span>
      <el-button @click="dialogVisible = !dialogVisible" type="text">
        修改手机号
      </el-button>
    </div>
    <div v-else>
      <span class="font_size passwordSpan">未绑定手机号</span>
      <el-button @click="dialogVisible = !dialogVisible" type="text"
        >设置手机号
      </el-button>
    </div>
    <el-dialog
      :modal="false"
      title="手机号"
      v-model="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <div style="margin-top: -20px">
        <el-input
          class="passwordInput"
          placeholder="请输入手机号"
          prefix-icon="el-icon-lock"
          :clearable="true"
          v-model="phoneNum"
        >
        </el-input>
        <el-input
          class="passwordInput"
          placeholder="请输入验证码"
          prefix-icon="el-icon-lock"
          :clearable="true"
          v-model="verifyCode"
        >
          <template #append>
            <el-button>获取验证码</el-button>
          </template>
        </el-input>

        <el-row>
          <el-button @click="submit" class="btnPassword">修改手机号</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'setMobile',
  data() {
    return {
      dialogVisible: false,
      userInfo: {},
      phoneNum: '',
      verifyCode: '',
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      if (this.$user.token) {
        this.userInfo = this.$user.userInfo
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    //  提交
    submit() {},
  },
}
</script>

<style lang="scss" scoped>
@import '../../../../static/style/base';

.passwordSpan {
  display: block;
  font-weight: bold;
}

.passwordInput {
  margin: 10px 0;
}

.btnPassword {
  width: 100%;
  margin-top: 20px;
}
</style>
