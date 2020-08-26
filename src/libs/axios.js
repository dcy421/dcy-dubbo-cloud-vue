import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
  }

  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {}
    }
    return config
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 权限信息
      if (store.getters.token) {
        config.headers['Authorization'] = store.getters.token
      }
      return config
    }, error => {
      console.log(error) // for debug
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(response => {
      // 数据源格式
      // code data msg success
      // if the custom code is not 20000, it is judged as an error.
      const res = response.data
      if (res.code !== 200) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })

        if (res.code === 3000) {
          // to re-login
          MessageBox.confirm('登录已经过期了，请重新登录！', '提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '关闭',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    }, error => {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    })
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
