import { xhrService } from '../config/network'
// import router from '../router'
import apiActions from '../config/api'
import Toggle from '../config/Toggle'

const MUTATIONS = {
  SET_TOGGLE_INIT (state, { apiAction }) {
    state[apiAction].toggle.setInit()
  },
  SET_TOGGLE_LOADING (state, { apiAction }) {
    state[apiAction].toggle.setLoading()
  },
  SET_TOGGLE_SUCCESS (state, { apiAction }) {
    state[apiAction].toggle.setSuccess()
  },
  SET_TOGGLE_FAIL (state, { apiAction }) {
    state[apiAction].toggle.setFail()
  },
  SET_TOGGLE_EMPTY (state, { apiAction }) {
    state[apiAction].toggle.setEmpty()
  },
  SET_API_DATA (state, { apiAction, data }) {
    state[apiAction].data = data
  }
}
const moduleList = Object.keys(apiActions || {}).map(moduleName => {
  // 导入接口配置生成对应state
  const stateList = Object.keys(apiActions[moduleName] || {}).map(actionName => {
    return {
      [actionName]: {
        toggle: new Toggle(),
        data: null
      }
    }
  })
  // 将api中定义的apiActions制作成action
  const actionList = Object.keys(apiActions[moduleName] || {}).map(actionName => {
    return {
      [actionName]: ({ commit, dispatch, state, rootState }, { params = {}, restfulParams = {}, header = {}, ...options } = {}) => {
        const { url = '', method = 'POST', header: apiParamsHeader = {}, ...restApiParams } = apiActions[moduleName][actionName] || {}
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
        commit('SET_TOGGLE_LOADING', { apiAction: actionName })
        return new Promise((resolve, reject) => {
          xhrService(webServiceParams).then(response => {
            if (response.data.status === 200) { // 接口返回成功状态
              commit('SET_TOGGLE_SUCCESS', { apiAction: actionName })
              commit('SET_API_DATA', { apiAction: actionName, data: response.data.data })
              resolve(response.data)
            } else {
              if (response.data.status === 402) {
              }
              commit('SET_TOGGLE_FAIL', { apiAction: actionName })
              reject(response.data)
            }
          }).catch(error => {
            commit('SET_TOGGLE_FAIL', { apiAction: actionName })
            reject(error)
          })
        })
      }
    }
  })
  const module = {
    [moduleName]: {
      namespaced: true,
      state: Object.assign(...stateList),
      actions: Object.assign(...actionList),
      mutations: Object.assign({}, MUTATIONS)
    }
  }
  return module
})
const modulesApi = {
  namespaced: true, // 独立命名空间
  state: {},
  actions: {},
  mutations: {},
  modules: Object.assign(...moduleList)
}
console.log('modulesApi', modulesApi, 'moduleList', moduleList)
export default modulesApi
