import request from '/common/request'
export default class noteBookServe {
  //获取笔记本列表
  static getNoteBook(params) {
    return request.get('/noteBook/list', params).then((res) => res)
  }
  //  创建笔记本
  static createNoteBook(params) {
    return request.post('/noteBook/create', params).then((res) => res)
  }
  //  绑定笔记本
  static bindNoteBook(noteId, noteBookId) {
    let params = {}
    params.notebook_id = noteBookId
    params.source_id = noteId
    return request.post('/noteBook/bindSource', params).then((res) => res)
  }
  //  删除笔记本
  static delNoteBook(noteBookId) {
    return request.delete(`/noteBook/${noteBookId}`).then((res) => res)
  }
}
