import Router from '@/router'
export default {
  // userInfo:localStorage.getItem("userInfo"),
  userInfo: {
    id: 1,
    name: 'Jack',
    //头像
    avatar: '',
    phone: '18720427542',
    email: '2624302837@qq.com',
    password: '123123',
    sex: '2',
    //签名
    sign: '',
  },
  //    用户是否登录
  token: false,
  //    验证路由
  checkRouter(info) {
    if (this.token) {
      Router.push(info)
    } else {
      Router.push('/login')
    }
  },
}
