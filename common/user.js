import Router from '@/router'
import baseFun from './baseFun'
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
  updateUserInfo() {
    this.userInfo = JSON.parse(baseFun.getStorage('animalsUserInfo'))
    this.token = baseFun.getStorage('animalsToken')
  },
}
