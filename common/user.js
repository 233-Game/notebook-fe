import Router from '@/router'
import commonFun from '/common/commonFunction'
export default {
  // userInfo:localStorage.getItem("userInfo"),
  userInfo: {},
  //    用户是否登录
  token: '',
  //    验证路由
  checkRouter(info) {
    if (this.token) {
      Router.push(info)
    } else {
      Router.push('/login')
    }
  },
  //  设置用户信息
  setUserInfo() {
    this.userInfo = JSON.parse(commonFun.getStorage('animalsUserInfo'))
    this.token = commonFun.getStorage('token')
  },
}
