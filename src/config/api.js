import { xhrService } from './network'
const api = {
  user: {
    getUserInfo: { // 获取用户信息
      url: '/getMyUserInfo',
      method: 'POST'
    }
  },
  base: {
    getWeChatInfo: { // 获取微信配置
      url: '/getWXJsConfig',
      method: 'POST'
    }
  },
  activity: {
    getActivityInfo: { // 获取活动信息
      url: '/getActivityInfo',
      method: 'POST'
    }
  }
}
const moduleList = Object.keys(api || {}).map(moduleName => {
  const actionList = Object.keys(api[moduleName] || {}).map(actionName => {
    return {
      [actionName]: ({ params = {}, restfulParams = {}, headers = {}, ...options } = {}) => {
        const { url = '', method = 'POST', headers: apiParamsHeader = {}, ...restApiParams } = api[moduleName][actionName] || {}
        const webServiceParams = Object.assign({
          url,
          method,
          params,
          headers: {
            // 'Content-Type': 'application/json;charset=UTF-8'
          }
        }, restApiParams, options)
        webServiceParams.headers = Object.assign(webServiceParams.headers, (apiParamsHeader.headers || {}), (options.headers || {}))
        Object.keys(restfulParams).map(key => {
          webServiceParams.url = webServiceParams.url.replace(`{${key}}`, restfulParams[key])
        })
        // console.log('webServiceParams', webServiceParams)
        return new Promise(async (resolve, reject) => {
          try {
            const response = await xhrService(webServiceParams)
            // console.log('xhrService response', response)
            if (response.data.status === 200) { // 接口返回成功状态
              resolve(response.data)
            } else {
              reject(response.data)
            }
          } catch (error) {
            // console.error('xhrService error', error)
            reject(error)
          }
        })
      }
    }
  })
  return Object.assign({ [moduleName]: Object.assign(...actionList) })
})
export default Object.assign(...moduleList)
