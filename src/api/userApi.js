import request from '/common/request'
export default class userServe {
  //用户登录
  static userLogin(params = {}, type = 'password') {
    //密码登录
    if (type === 'password') {
      return request.post('/login', params)
    } else if (type === 'verifyCode') {
      params.code = params.password
      return request.post('/loginByPhoneCode', params)
    }
  }
  //  获取验证码
  static getVerifyCode(params) {
    return request.post('/phoneCode', params)
  }
}
