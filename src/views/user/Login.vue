<template>
  <div class="vLogin userSelect">
    <div class="card" :style="cssVars">
      <!--      logo-->
      <div class="logo"></div>
      <!--      登录框-->
      <div class="loginBox">
        <el-form class="formInput" label-position="right" label-width="0px">
          <!--          账号-->
          <el-form-item>
            <el-input
              prefix-icon="el-icon-user-solid"
              class="inner"
              maxlength="11"
              placeholder="手机号"
              v-model="phoneNum"
              @focus="showUserList = false"
            >
            </el-input>
            <svg
              @click="showUserList = !showUserList"
              class="showUser"
              aria-hidden="true"
            >
              <use xlink:href="#icondown2"></use>
            </svg>

            <Scroll
              v-if="showUserList"
              class="userList"
              scroll-height="200px"
              :is-open-pull-load="false"
              :is-open-pull-rush="false"
            >
              <template v-slot:searchInput><span></span></template>
              <template v-slot:scrollContent>
                <span v-if="userList.length === 0"></span>
                <div
                  class="listItem flex_ACenter"
                  v-else
                  v-for="(item, index) in userList"
                  :key="index"
                  @click="currentUser(index)"
                >
                  {{ item.id }}
                  <span
                    @click.stop.prevent="delUser(index)"
                    class="delUser el-icon-close"
                  ></span>
                </div>
              </template>
            </Scroll>
          </el-form-item>
          <!--          密码-->
          <el-form-item v-if="isVerify === false">
            <el-input
              :prefix-icon="icon"
              v-model="password"
              class="inner"
              placeholder="密码"
              type="password"
              @focus="icon = 'el-icon-unlock'"
              @blur="icon = 'el-icon-lock'"
              @keyup.enter="submit"
            ></el-input>
          </el-form-item>
          <!--          验证码-->
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
              @keyup.enter="submit"
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
          <!--          登录按钮-->
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
        <div class="quickLogin">
          <svg aria-hidden="true" class="codeIcon">
            <use xlink:href="#iconerweima1"></use>
          </svg>
        </div>
      </div>
    </div>
    <Tip
      ref="delUser"
      tip-icon="#icondelete-user"
      tip-title="删除用户"
      @definite="delUserDefinite"
    >
      <span class="font_size_30">确定删除该用户吗？</span>
    </Tip>
  </div>
</template>

<script>
import userServe from '@/api/userApi'
import Scroll from '@/components/basisModule/scroll'
import Tip from '@/components/panel/Tip'
export default {
  name: 'Login',
  components: {
    Scroll,
    Tip,
  },
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
      //  历史用户列表
      userList: [],
      //  展示用户列表
      showUserList: false,
    }
  },
  setup() {
    function login() {
      this.loading = true
      userServe
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
    //获取用户登录过的列表
    let userList = JSON.parse(this.$baseFun.getStorage('animalsIdList'))
    this.userList = userList ? userList : []
    this.currentUser(0)
  },
  methods: {
    //记住密码
    rePassword() {
      if (this.isVerify) {
        this.rememberPass = false
        this.$baseFun.__message('使用验证码登录不可记住密码')
      }
    },
    //  登录
    submit() {
      //判断是否填入密码或验证码
      if (this.password === '' && this.verifyCode === '') {
        this.$baseFun.__message('请输入验证码或密码')
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
      userServe
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
      this.password = ''
      this.verifyCode = ''
    },
    //  登录成功，设置本地存储
    setLocalStorageUserInfo(data) {
      console.log('data', data)
      //设置状态信息
      //保存用户基本信息
      this.$baseFun.setStorage('animalsUserInfo', JSON.stringify(data.user))
      //保存用户口令
      this.$baseFun.setStorage(
        'animalsToken',
        this.$config.tokenSalt + data.token
      )
      //更新user文件表
      this.$user.updateUserInfo()
      this.loading = false
      //跳转到index
      this.$router.push('/index')
      //  判断是否是记住密码
      if (this.rememberPass) {
        this.saveUserList(this.phoneNum, data.remember_token, true)
      } else {
        // 否，清除本地密码token记录
        this.saveUserList(this.phoneNum, '', false)
      }
    },
    //  存储用户账号密码集 账号，密码，记住密码
    saveUserList(id, password, remPassword) {
      //获取本地存储的id列表
      let idList = JSON.parse(this.$baseFun.getStorage('animalsIdList'))
      idList = idList ? idList : []
      //当remPassword不为空时是setLocalStorageUserInfo调用
      //否则delUserDefinite调用
      if (password === '' && remPassword === '') {
        idList.splice(id, 1)
      } else {
        let index = 0
        for (const item of idList) {
          if (item.id === id) {
            idList.splice(index, 1)
          }
          index++
        }
        idList.unshift({ id: id, password: password, remPassword: remPassword })
      }
      // 存入本地
      this.$baseFun.setStorage('animalsIdList', JSON.stringify(idList))
    },
    //  切换用户
    currentUser(current) {
      if (!this.userList[current]) return
      this.phoneNum = this.userList[current].id
      this.password = this.userList[current].password
      this.rememberPass = this.userList[current].remPassword
      this.showUserList = false
    },
    delUser(index) {
      this.$refs.delUser.open(index)
    },
    //  确定移除用户
    delUserDefinite(delUserId) {
      //判断当前输入框里是不是该账号
      if (this.phoneNum === this.userList[delUserId].id) {
        this.phoneNum = ''
        this.password = ''
      }
      this.showUserList = false
      this.$refs.delUser.close()
      //移出列表
      this.userList.splice(delUserId, 1)
      this.saveUserList(delUserId, '', '')
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
<style lang="scss" scoped>
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
    position: relative;
    width: 40%;
    height: 100%;
    box-sizing: border-box;
    padding: 40px 20px;
    overflow: hidden;
  }

  .formInput {
    margin: 10% 0;
    transform: translateY(0);
  }
}
.userList {
  position: absolute;
  width: 100%;
  height: 200px;
  box-shadow: 0 5px 10px 3px rgba(0, 0, 0, 0.3);
  z-index: 2;
  margin-top: 2px;
  .listItem {
    position: relative;
    padding: 0 15px;
    .delUser {
      position: absolute;
      right: 10px;
      cursor: pointer;
    }
  }
  .listItem:hover {
    background-color: rgba(#526479, 0.8);
    color: #ffffff;
  }
}
.showUser {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: inline-block;
  width: 10px;
  height: 10px;
  padding: 15px;
  cursor: pointer;
}
.quickLogin {
  position: absolute;
  right: -50px;
  bottom: -50px;
  width: 100px;
  height: 100px;
  background-color: rgba(#526479, 0.6);
  transform: rotate(45deg);
  overflow: hidden;
  cursor: pointer;
  .codeIcon {
    width: 75px;
    height: 75px;
    position: absolute;
    left: -25px;
    top: 10px;
    transform: rotate(-45deg);
  }
}
</style>
