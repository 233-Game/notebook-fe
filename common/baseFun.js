import { ElMessage, ElLoading } from 'element-plus'
export default {
  loading: '',
  //设置本地存储
  setStorage(key, val) {
    localStorage.setItem(key, val)
  },
  //获取本地存储
  getStorage(key) {
    return localStorage.getItem(key)
  },
  //删除本地存储的某个信息
  removeStorage(key) {
    return localStorage.removeItem(key)
  },
  //  消息提示
  __message(message, type = 'error', duration = 2000) {
    ElMessage({
      message: message,
      type: type,
      duration: duration,
      center: true,
    })
  },
  //  加载
  __loading(text, spinner = 'el-icon-loading') {
    this.loading = ElLoading.service({
      lock: true,
      text: text,
      spinner: spinner,
      background: 'rgba(255,255,255, 0.7)',
    })
  },
  //  关闭加载
  __closeLoading() {
    if (this.loading) this.loading.close()
  },
}
