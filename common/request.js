// 引入配置文件
import User from './user.js'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import Config from './config'

//请求拦截
axios.interceptors.request.use(
  (config) => {
    if (User.token) {
      config.headers['token'] = Config.token
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
//响应拦截
axios.interceptors.response.use(
  (response) => {
    //  判断返回的状态码是否为200
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  (err) => {
    //  请求出错
    ElMessage.error('请求失败')
    console.log('err', err)
  }
)
export default class request {
  static instance = axios.create({
    // baseURL: User.webUrl,
    timeout: 10000, //请求超时
  })
  VueAxios() {
    return request.instance
  }
  static get(url, params, header = {}) {
    return new Promise((resolve, reject) => {
      request.instance
        .get(url, { params: params }, { headers: header })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  static post(url, params, header = {}) {
    return new Promise((resolve, reject) => {
      request.instance
        .post(url, params, { headers: header })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
