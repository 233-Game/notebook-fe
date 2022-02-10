// 引入配置文件
import User from './user.js'
import axios from 'axios'
import baseFun from './baseFun'
import router from '@/router'
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
            config.headers['Authorization'] = User.token
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
          if (response.status >= 200) {
            return Promise.resolve(response)
          } else {
            baseFun.__closeLoading()
            return Promise.reject(response)
          }
        },
        (err) => {
          //判断状态码是否是401 401为token过期
          if (err.response.status === 401) {
            baseFun.__message('token已过期，请重新登录')
            baseFun.removeStorage('animalsToken')
            baseFun.removeStorage('animalsUserInfo')
            User.updateUserInfo()
            router.push('/login')
            baseFun.__closeLoading()
            return Promise.reject(err.response)
          }
          //  请求出错
          baseFun.__message(err.response.data.message)
          baseFun.__closeLoading()
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
  static put(url, params, header = {}) {
    return new Promise((resolve, reject) => {
      request
        .getInstance()
        .put(url, params, { headers: header })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  static delete(url, params = {}, header = {}) {
    return new Promise((resolve, reject) => {
      request
        .getInstance()
        .delete(url, params, { headers: header })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
