import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import router from '@/router'
import vue from 'vue'
const that = vue.prototype
const baseUrl = '/api' // http://192.168.31.237:8080
// create an axios instance
// process.env.VUE_APP_BASE_API
const service = axios.create({
  baseURL: baseUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
service.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded' // 配置请求头（推荐）
service.defaults.headers.patch['Content-Type'] = 'multipart/form-data'
// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    that.$message({
      message: '网络请求错误',
      center: true,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          // router.replace({
          //   path: '/login',
          //   query: { redirect: router.currentRoute.fullPath }
          // })
          break
        case 403:
          that.$message({
            message: '身份失效，请重新登录',
            center: true,
            type: 'error'
          })
          // 清除token
          store.dispatch('user/logout')
          break
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 400:
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          // setTimeout(() => {
          //   router.replace({
          //     path: '/login',
          //     query: {
          //       redirect: router.currentRoute.fullPath
          //     }
          //   })
          // }, 1000)
          break
        // 404请求不存在
        case 404:
          that.$message({
            message: '网络请求不存在',
            center: true,
            type: 'error'
          })
          break
        // 其他错误，直接抛出错误提示
        default:
          that.$message({
            message: '连接出错',
            center: true,
            type: 'error'
          })
      }
      return Promise.reject(error.response)
    } else {
      that.$message({
        message: '无法连接',
        center: true,
        type: 'error'
      })
      return Promise.reject(error.response)
    }
  }
)
export default service
