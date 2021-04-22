import request from '/common/request'
export default class servers {
  //获取笔记本
  static getNoteBook(params = {}) {
    return request.post('search/searchUser', params)
  }
}
