<template>
  <div>
    <!--    主要信息-->
    <div class="flex_ACenter">
      <el-avatar
        v-if="!userInfo.avatar"
        :size="45"
        icon="el-icon-user-solid"
        style="fontsize: 30px"
      ></el-avatar>

      <!-- 自定义头像 -->
      <div v-else class="photo">
        <img :src="webUrl + userInfo.avatar" alt="" />
      </div>
      <span class="username">
        {{ userInfo.name }}
      </span>
    </div>
    <!--    基本信息-->
    <div class="basicInfo">
      <div class="flex_ACenter">
        <span class="font_size spanMargin">昵称</span>
        <input
          class="nameInput font_size"
          type="text"
          maxlength="6"
          v-model="userInfo.name"
        />
      </div>
      <div class="flex_ACenter">
        <span class="font_size spanMargin">邮箱</span>
        <input
          class="nameInput font_size"
          type="text"
          v-model="userInfo.email"
        />
      </div>
      <div>
        <span class="font_size spanMargin">性别</span>
        <el-radio v-model="sex" @change="changRadio" label="1">男</el-radio>
        <el-radio v-model="sex" @change="changRadio" label="2">女</el-radio>
        <el-radio v-model="sex" @change="changRadio" label="3">保密</el-radio>
      </div>
      <div>
        <span class="font_size spanMargin">签名</span>
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          maxlength="100"
          resize="none"
          v-model="sign"
        >
        </el-input>
      </div>
    </div>
    <!--      修改-->
    <div class="btn flex_ACenter">
      <el-button @click="loginOut()" class="loginout" type="info" round
        >退出登录
      </el-button>
      <el-button
        @click="submit"
        class="save"
        :disabled="isBtn"
        type="info"
        round
        >保存
      </el-button>
    </div>
  </div>
</template>

<script>
let isWatch = false
let that = null
export default {
  name: 'Account',
  data() {
    return {
      sex: '',
      sign: '',
      isBtn: true,
      userInfo: {},
      webUrl: process.env.VUE_APP_PROXY_PATH,
    }
  },
  created() {
    console.log(this.webUrl)
    this.$nextTick(() => {
      isWatch = true
      that = this
    })
    this.getUserInfo()
    this.sex = this.userInfo.sex
    this.sign = this.userInfo.sign
  },
  watch: {
    userInfo: {
      handler(value) {
        if (isWatch) {
          console.log('1', value)
          that.isBtn = false
        }
      },
      deep: true,
    },
    sign(val) {
      this.userInfo.sign = val
    },
  },
  methods: {
    changRadio(info) {
      this.sex = info
      this.userInfo.sex = info
    },
    getUserInfo() {
      if (this.$user.token) {
        this.userInfo = this.$user.userInfo
      }
    },
    submit() {
      if (!this.isBtn) {
        console.log(this.userInfo)
      }
    },
    //退出登录
    loginOut() {
      this.$commonFun.removeStorage('token')
      this.$commonFun.removeStorage('animalsUserInfo')
      this.$user.setUserInfo()
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../static/style/base';
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

.username {
  margin-left: 20px;
  font-size: 16px;
  font-weight: bold;
}

.basicInfo {
  margin: 20px 0 0 0;
  width: calc(100% - 40px);
  height: 50%;
  background-color: #fff;
  padding: 20px;

  div {
    margin: 10px 0;
  }
}

.nameInput {
  flex: 1;
  border: none;
  outline: none;
}

.spanMargin {
  display: inline-block;
  margin-right: 15px;
}

.btn {
  position: fixed;
  right: 40px;
  margin-top: 20px;
  border: none;
}
</style>
