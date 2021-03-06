import request from '/common/request'
export default class noteServe {
  //  保存笔记
  static saveNote(id, params = {}) {
    return request.put(`/source/${id}`, params).then((res) => res)
  }
  //  创建笔记
  static createNote(params = {}) {
    return request.post('/source/create', params)
  }
  //获取笔记列表（默认）
  static getDefaultNote(params) {
    return request.get(`/source/list`, params).then((res) => res)
  }
  //  收藏笔记<缺url>
  static collectNote(noteId) {
    return request.post('/source/star', { id: noteId })
  }
  //取消收藏
  static cancelCollectNote(noteId) {
    return request.post('/source/unStar', { id: noteId })
  }
  //  获取单个笔记详情
  static getNoteContent(noteId) {
    let url = `/source/${noteId}`
    return request.get(url)
  }
  //  删除笔记
  static delNote(noteId) {
    return request.delete(`/source/${noteId}`).then((res) => res)
  }
}
