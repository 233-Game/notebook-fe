import request from '/common/request'
export default class servers {
  static userLogin(url, params = {}) {
    return request.post(url, params)
  }
}
