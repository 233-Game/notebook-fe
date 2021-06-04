import request from '/common/request'
export default class signServe {
  //  移动到笔记本<缺url>
  static toNoteBook(noteId, noteBookId) {
    let url = `/[url]?noteId=${noteId}&noteBookId=${noteBookId}`
    return request.post(url)
  }
}
