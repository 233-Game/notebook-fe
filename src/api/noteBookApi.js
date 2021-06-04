import request from '/common/request'
export default class noteBookServe {
  //获取笔记本列表
  static getNoteBook(page) {
    return request.get('/noteBook/list', { page: page }).then((res) => res)
  }
  //  创建笔记本
  static createNoteBook(params) {
    return request.post('/noteBook/create', params).then((res) => res)
  }
}
