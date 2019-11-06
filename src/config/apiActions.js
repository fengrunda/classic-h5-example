import { xhrService } from './network'
const api = {
  user: {
    getUserInfo: { // 获取用户信息
      url: '/api/community/getMyUserInfoForActivity',
      method: 'POST'
    }
  },
  base: {
    getWeChatInfo: { // 获取微信配置
      url: '/api/community/weixin/getWXJsConfig',
      method: 'POST'
    }
  },
  activity: {
    getActivityInfo: { // 获取活动信息
      url: '/api/community/getActivityInfo',
      method: 'POST'
    }
  }
}
const moduleList = Object.keys(api || {}).map(moduleName => {
  const actionList = Object.keys(api[moduleName] || {}).map(actionName => {
    return {
      [actionName]: ({ params = {}, restfulParams = {}, header = {}, ...options } = {}) => {
        const { url = '', method = 'POST', header: apiParamsHeader = {}, ...restApiParams } = api[moduleName][actionName] || {}
        const webServiceParams = Object.assign({
          url,
          method,
          params,
          header: {}
        }, restApiParams, options)
        webServiceParams.header = Object.assign(webServiceParams.header, (apiParamsHeader.header || {}), (options.header || {}))
        Object.keys(restfulParams).map(key => {
          webServiceParams.url = webServiceParams.url.replace(`{${key}}`, restfulParams[key])
        })
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