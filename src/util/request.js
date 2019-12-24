import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: 'http://localhost:9030/',
  timeout: 10000,
  responseType: 'json',
  validateStatus (status) {
    return status === 200
  }
})

const refreshService = axios.create({
  baseURL: 'http://localhost:9030/',
  timeout: 10000,
  responseType: 'json',
  validateStatus (status) {
    return status === 200
  }
})

service.interceptors.request.use(
  config => {
    let _config = config
    try {
      // const expireTime = getExpireTime()
      // if (expireTime) {
      //   const left = expireTime - new Date().getTime()
      //   const refreshToken = getRefreshToken()
      //   if (left < 5 * 60 * 1000 && refreshToken) {
      //     _config = queryRefreshToken(_config, refreshToken)
      //   } else {
      //     if (getToken()) {
      //       _config.headers['Authorization'] = 'bearer ' + getToken()
      //     }
      //   }
      // }
    } catch (e) {
      console.error(e)
    }
    return _config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use((config) => {
  return config
}, (error) => {
  if (error.response) {
    const errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
    switch (error.response.status) {
      case 404:
        Message({
          message: '很抱歉，资源未找到' || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        break
      case 403:
        Message({
          message: '很抱歉，您暂无该操作权限' || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        break
      case 401:
        Message({
          message: '很抱歉，认证已失效，请重新登录' || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        break
      default:
        if (errorMessage) {
          Message({
            message: errorMessage,
            type: 'error',
            duration: 5 * 1000
          })
        }
        break
    }
  }
  return Promise.reject(error)
})

const request = {
  refresh (url, params) {
    params['grant_type'] = 'refresh_token'
    return refreshService.post(url, params, {
      transformRequest: [(params) => {
        return tansParams(params)
      }],
      headers: {
        'Authorization': 'Basic aGM6MTIzNDU2'
      }
    })
  },
  login (url, params) {
    params['grant_type'] = 'password'
    return service.post(url, params, {
      transformRequest: [(params) => {
        return tansParams(params)
      }],
      headers: {
        'Authorization': 'Basic aGM6MTIzNDU2'
      }
    })
  },
  post (url, params) {
    return service.post(url, params, {
      transformRequest: [(params) => {
        return tansParams(params)
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  put (url, params) {
    return service.put(url, params, {
      transformRequest: [(params) => {
        return tansParams(params)
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  get (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.get(`${url}${_params}`)
  },
  delete (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.delete(`${url}${_params}`)
  },
  download (url, params, filename) {
    return service.post(url, params, {
      transformRequest: [(params) => {
        return tansParams(params)
      }],
      responseType: 'blob'
    }).then((r) => {
      const content = r.data
      const blob = new Blob([content])
      if ('download' in document.createElement('a')) {
        const elink = document.createElement('a')
        elink.download = filename
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
      } else {
        navigator.msSaveBlob(blob, filename)
      }
    }).catch((r) => {
      console.error(r)
      Message({
        message: '下载失败',
        type: 'error',
        duration: 5 * 1000
      })
    })
  },
  upload (url, params) {
    return service.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

function tansParams (params) {
  let result = ''
  Object.keys(params).forEach((key) => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
      result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
    }
  })
  return result
}

export default request
