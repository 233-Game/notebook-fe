// 引入配置文件
import User from './user.js'
import axios from 'axios'
import Config from './config'

export default class request {
  static instance
  static getInstance() {
    if (!self.instance) {
      //请求拦截
      self.instance = axios.create({
        // baseURL: User.webUrl,
        timeout: 10000, //请求超时
      })
      self.instance.interceptors.request.use(
        (config) => {
          if (User.token) {
            config.headers['token'] = Config.token
          }
          return config
        },
        (error) => {
          // for debug
          return Promise.reject(error)
        }
      )
      //响应拦截
      self.instance.interceptors.response.use(
        (response) => {
          //  判断返回的状态码是否为200
          if (response.status < 400 && response.status >= 200) {
            return Promise.resolve(response)
          } else {
            return Promise.reject(response)
          }
        },
        (err) => {
          //  请求出错
          Config.__message(err.response.data.message)
          return Promise.reject(err.response)
        }
      )
    }
    return self.instance
  }
  static get(url, params, header = {}) {
    return new Promise((resolve, reject) => {
      request
        .getInstance()
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
      request
        .getInstance()
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
