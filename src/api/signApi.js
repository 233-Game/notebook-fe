import request from '/common/request'

export default class signServe {
  //  移动到笔记本
  static bindSign(noteId, tagId) {
    return request.post('/tag/bind', {
      source_id: noteId,
      tag_id: tagId,
    })
  }

  static creatSign(name, desc = '') {
    return request
      .post('/tag/create', {
        name,
        desc,
      })
      .then((res) => res.data)
  }

  static getList() {
    return request.get('/tag/list')
  }

  static delete(tagId) {
    return request.delete(`/tag/${tagId}`).then((res) => res.data)
  }

  static update(data) {
    return request.put(`/tag/${data.id}`, data).then((res) => res.data)
  }

  static showNotes(id, page) {
    return request.get(`/tag/sources`, { id, page }).then((res) => res.data)
  }

  static unbind(tagId, noteId) {
    return request
      .post('/tag/unbind', {
        source_id: noteId,
        tag_id: tagId,
      })
      .then((res) => res.data)
  }
}
