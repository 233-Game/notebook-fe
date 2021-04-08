<template>
  <div class="vLogin">
    <div class="card">
      <!--      logo-->
      <div class="logo"></div>
      <!--      登录框-->
      <div class="loginBox">
        <el-form class="formInput" label-position="right" label-width="0px">
          <el-form-item>
            <el-input
              prefix-icon="el-icon-user-solid"
              class="inner"
              maxlength="11"
              placeholder="手机号"
              v-model="phoneNum"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-if="isVerify === false">
            <el-input
              :prefix-icon="icon"
              v-model="password"
              class="inner"
              maxlength="16"
              placeholder="密码"
              type="password"
              @focus="icon = 'el-icon-unlock'"
              @blur="icon = 'el-icon-lock'"
            ></el-input>
          </el-form-item>
          <el-form-item class="verifyBox" v-else>
            <el-input
              prefix-icon="el-icon-message"
              v-model="verifyCode"
              class="inner"
              maxlength="6"
              placeholder="验证码"
              type="text"
              @focus="icon = 'el-icon-unlock'"
              @blur="icon = 'el-icon-lock'"
            >
            </el-input>
            <!--          验证码按钮-->
            <el-button
              class="verifyCode"
              type="info"
              size="mini"
              :disabled="verifyIsDisabled"
              @click="getVerifyCode()"
              >{{ verifyTip }}</el-button
            >
          </el-form-item>
          <div class="checkBox flex_ACenter">
            <el-checkbox v-model="rememberPass" @change="rePassword()"
              >记住密码</el-checkbox
            >
            <span @click="isUseVerify()">{{ passOrVerify }}</span>
            <span>忘记密码</span>
          </div>
          <el-form-item>
            <el-button class="btnLogin" type="primary" @click="submit()">
              <span>登录</span>
              <i v-if="loading" class="el-icon-loading"></i>
            </el-button>
          </el-form-item>
          <div class="otherLogin flex_ACenter">
            <img src="../../../static/svg/wx.svg" alt="" />
            <img src="../../../static/svg/weibo.svg" alt="" />
            <img src="../../../static/svg/github.svg" alt="" />
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      //加载
      loading: false,
      phoneNum: '',
      password: '',
      //是否记住密码
      rememberPass: true,
      icon: 'el-icon-lock',
      //  是否使用验证码
      isVerify: false,
      verifyCode: '',
      verifyTip: '获取验证码',
      verifyIsDisabled: false,
      passOrVerify: '验证码登录',
    }
  },
  methods: {
    //记住密码
    rePassword() {
      //  将密码存储到本地
      this.$config.setStorage(`noteBook_${this.phoneNum}`, this.password)
    },
    //  登录
    submit() {
      if (this.rememberPass) {
        this.rePassword()
      }
      console.log('登录')
    },
    //  获取验证码
    getVerifyCode() {
      let code = 60
      this.verifyTip = code
      let time = setInterval(() => {
        this.verifyIsDisabled = true
        code -= 1
        this.verifyTip = code
        if (code === 0) {
          clearInterval(time)
          this.verifyTip = '获取验证码'
          this.verifyIsDisabled = false
        }
      }, 1000)
    },
    //  设置短信还是密码·
    isUseVerify() {
      this.isVerify = !this.isVerify
      this.isVerify
        ? (this.passOrVerify = '账号密码登录')
        : (this.passOrVerify = '验证码登录')
    },
  },
}
</script>

<style lang="scss">
@import '../../../static/style/base';

.vLogin {
  position: relative;
  width: 100vw;
  height: 100vh;
  .card {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    width: 40vw;
    height: 50vh;
    box-shadow: 3px 5px 20px 3px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
  }

  .logo {
    flex: 1;
    width: 10px;
    height: 100%;
    background-color: #526472;
  }

  .loginBox {
    width: calc(40% - 40px);
    height: calc(100% - 80px);
    padding: 40px 20px;
  }
  .formInput {
    margin-top: 70%;
    transform: translateY(-50%);
  }
  .el-card {
    //   background-color: #f3f3f3;
    background: none;
    border: none;
    opacity: 0.8;
    padding: 40px 40px 10px;
  }
  .el-form-item__label {
    color: #fff !important;
  }
  .inner {
    input {
      background: none;
      font-size: 16px;
      border: none;
      border-bottom: 0.3px solid #cccccc;
      border-radius: 0;
    }
    .el-input__icon {
      font-size: 16px;
    }
  }
  .inner:focus-within {
    .el-input__icon {
      color: #3f8dde;
    }
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #dcdfe6;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #526472;
  }
  .is-focus {
    background: none !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    border-color: #526472;
  }

  .checkBox {
    position: relative;
    display: flex;
    justify-content: space-between;
    color: #a6acb5 !important;
    height: 20px;
    margin: 15px 0;
    span {
      font-size: 14px;
      cursor: pointer;
    }
  }
  .el-checkbox__input.is-checked + .el-checkbox__label,
  .el-checkbox__label {
    color: #a6acb5 !important;
  }
  .btnLogin {
    //登录按钮
    width: 100%;
    background-color: #526479;
    color: #ffffff;
    border-color: #526479;
  }
  .btnLogin:hover {
    background-color: rgba(#526479, 0.8);
    border-color: rgba(#526479, 0.8);
  }
  .verifyBox {
    position: relative;
    width: 100%;
  }
  .verifyCode {
    position: absolute;
    right: 0;
    width: 90px;
  }

  .otherLogin {
    display: flex;
    justify-content: space-around;
    width: 100%;
    img {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
