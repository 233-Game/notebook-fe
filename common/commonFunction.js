import servers from '@/api/noteApi'
export default {
  //设置本地存储
  setStorage(key, val) {
    localStorage.setItem(key, val)
  },
  //获取本地存储
  getStorage(key) {
    return localStorage.getItem(key)
  },
  //  获取笔记本
  __getNoteBook(keyword = null, page = 1) {
    servers.getNoteBook({ keyword: keyword, page: page }).then((res) => {
      return res
    })
  },
}
