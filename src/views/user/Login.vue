<template>
  <div class="vLogin userSelect">
    <div class="card" :style="cssVars">
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
          <div class="otherLoginText flex_ACenter_Jcenter">
            <div class="line"></div>
            <div class="loginText">第三方登录</div>
          </div>
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
import servers from '@/api/userApi'

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
      //判断获取验证码按钮是否可点
      verifyIsDisabled: false,
      passOrVerify: '验证码登录',
    }
  },
  setup() {
    function login() {
      this.loading = true
      servers
        .userLogin(
          {
            phone: this.phoneNum,
            password: this.password || this.verifyCode,
            remember_me: this.rememberPass,
          },
          this.password === '' ? 'verifyCode' : 'password'
        )
        .then((res) => {
          this.setLocalStorageUserInfo(res.data.data)
        })
        .catch(() => {
          this.loading = false
        })
    }
    return { login }
  },
  created() {
    //  判断本地是否有最近一次登录记录
    let animalsId = this.$commonFun.getStorage('animalsId')
    let password = this.$commonFun.getStorage('animalsPassword_' + animalsId)
    let animalsRememberPass = this.$commonFun.getStorage('animalsRememberPass')
    if (animalsId) {
      this.phoneNum = animalsId
    }
    if (password) {
      this.password = password
    }
    animalsRememberPass === 'true'
      ? (this.rememberPass = true)
      : (this.rememberPass = false)
  },
  methods: {
    //记住密码
    rePassword() {
      this.$commonFun.setStorage('animalsRememberPass', this.rememberPass)
    },
    //  登录
    submit() {
      //判断是否填入密码或验证码
      if (this.password === '' && this.verifyCode === '') {
        this.$config.__message('请输入验证码或密码')
      }
      this.login()
    },
    //  获取验证码
    getVerifyCode() {
      let code = 60
      this.verifyTip = code
      this.verifyIsDisabled = true
      let time = setInterval(() => {
        code -= 1
        this.verifyTip = code
        if (code === 0) {
          clearInterval(time)
          this.verifyTip = '获取验证码'
          this.verifyIsDisabled = false
        }
      }, 1000)
      servers
        .getVerifyCode({
          phone: this.phoneNum,
          type: 'login',
        })
        .then((res) => {
          console.log(res)
        })
    },
    //  设置短信还是密码
    isUseVerify() {
      this.isVerify = !this.isVerify
      if (this.isVerify) {
        this.passOrVerify = '账号密码登录'
        this.rememberPass = false
      } else {
        this.passOrVerify = '验证码登录'
        this.rememberPass = true
      }
      this.$commonFun.setStorage('animalsRememberPass', this.rememberPass)
      this.password = ''
      this.verifyCode = ''
    },
    //  登录成功，设置本地存储
    setLocalStorageUserInfo(data) {
      //设置状态信息
      this.$commonFun.setStorage('animalsUserInfo', JSON.stringify(data.user))
      this.$commonFun.setStorage('token', 'Bearer ' + data.token)
      this.$user.setUserInfo()
      this.loading = false
      //跳转到index
      this.$router.push('/index')
      //将该账号存储在本地方便下次登录
      this.$commonFun.setStorage('animalsId', this.phoneNum)
      //  判断是否是记住密码
      if (this.rememberPass) {
        //  将remember_token存储到本地
        this.$commonFun.setStorage(
          `animalsPassword_${this.phoneNum}`,
          data.remember_token
        )
      } else {
        this.$commonFun.removeStorage(`animalsPassword_${this.phoneNum}`)
      }
    },
  },
  computed: {
    cssVars() {
      const windowWidth = document.body.clientWidth
      if (windowWidth <= 1200) return { '--varWidth': '70vw' }
      else if (windowWidth <= 1500) return { '--varWidth': '60vw' }
      else return { '--varWidth': '45vw' }
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
    width: var(--varWidth);
    height: 60vh;
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
    width: 40%;
    height: 100%;
    box-sizing: border-box;
    padding: 40px 20px;
  }
  .formInput {
    margin: 10% 0;
    transform: translateY(0);
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
  .otherLoginText {
    width: 100%;
    margin: 20px auto;
    height: 30px;
    .line {
      position: absolute;
      width: 90%;
      height: 0;
      border-top: 1px solid #cccccc;
      z-index: -1;
    }
    .loginText {
      padding: 10px 5px;
      background-color: #fff;
      color: #666666;
      font-size: 14px;
    }
  }
}
</style>
