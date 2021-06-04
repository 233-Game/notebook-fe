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
  static getDefaultNote(page) {
    return request.get('/source/list', { page: page }).then((res) => res)
  }
  //  收藏笔记<缺url>
  static collectNote(params = {}) {
    return request.post('', params)
  }
  //  移动标记<缺url>
  static toSign(noteId, signId) {
    let url = `/[url]?noteId=${noteId}&noteBookId=${signId}`
    return request.post('', url)
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
