export default {
  setStorage(key, val) {
    localStorage.setItem(key, val)
  },
  getStorage(key) {
    return localStorage.getItem(key)
  },
}
