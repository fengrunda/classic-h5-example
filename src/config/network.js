import axios from 'axios'
const qs = require('qs')
axios.defaults.baseURL = '../../'
axios.defaults.timeout = 1000 * 60
// axios.defaults.transformRequest = [data => qs.stringify(data)]
axios.interceptors.response.use(response => {
  // Do something with response data
  return response
}, error => {
  // Do something with response error
  if (error.message.match('Network Error')) {
    error.message = '网络不给力！'
  }
  return Promise.reject(error)
})

const xhrService = ({ url, method, params, ...options }) => {
  let userRequestData = !!['PUT', 'POST', 'PATCH'].find(methodName => method.toUpperCase() === methodName)
  let axiosParams = Object.assign({
    method,
    url,
    data: userRequestData ? params : null,
    params: userRequestData ? null : params,
    headers: {},
    transformRequest: []
  }, options)
  const contentTypeKey = Object.keys(axiosParams.headers).find((key) => key.toLowerCase() === 'content-type') || ''
  const contentType = contentTypeKey ? axiosParams.headers[contentTypeKey] : ''
  if (!contentType.toLowerCase().match('application/json')) {
    const transformRequest = [(data) => qs.stringify(data)]
    axiosParams.transformRequest = transformRequest
  }
  return axios(Object.assign(axiosParams, options))
}

export {
  xhrService
}
