<template>
  <div>
    <div v-if="userInfo.password !== ''">
      <span class="font_size passwordSpan">已设置密码</span>
      <el-button @click="dialogVisible = !dialogVisible" type="text">
        修改密码
      </el-button>
    </div>
    <div v-else>
      <span class="font_size passwordSpan">未设置密码</span>
      <el-button @click="dialogVisible = !dialogVisible" type="text"
        >设置密码
      </el-button>
    </div>
    <el-dialog
      :modal="false"
      title="密码"
      v-model="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <div style="margin-top: -20px">
        <el-input
          class="passwordInput"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          :clearable="true"
          v-model="password"
        >
        </el-input>
        <el-input
          class="passwordInput"
          v-if="userInfo.password === ''"
          placeholder="请再次输入密码"
          prefix-icon="el-icon-lock"
          :clearable="true"
          v-model="checkPassword"
        >
        </el-input>
        <el-input
          class="passwordInput"
          v-else
          placeholder="请输入旧密码"
          prefix-icon="el-icon-lock"
          :clearable="true"
          v-model="oldPassword"
        >
        </el-input>
        <el-row>
          <el-button @click="submit" class="btnPassword">修改密码</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  name: 'SetPassword',
  data() {
    return {
      dialogVisible: false,
      userInfo: {},
      password: '',
      checkPassword: '',
      oldPassword: '',
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
    submit() {
      if (!this.password) {
        return ElMessage.error('请输入密码')
      }
      if (this.userInfo.password === '') {
        // 设置密码
        if (this.password === this.checkPassword) {
          console.log(this.password)
        } else {
          return ElMessage.error('密码不一致')
        }
      } else {
        //  修改密码
        console.log(this.password)
      }
    },
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
