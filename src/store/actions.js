import axios from 'axios'
import router from '../router'
import { apiActions } from '../config/api'
const ignoreIndicatorActionArr = [] // 不显示loading的接口名称
const ignoreCheckLoginPathArr = [] // 不检查登录状态的页面 '/compere'
// import router from '../router'
const co = require('co')
const actions = {
  /**
   * 初始化接口状态标识
   * @param {*} param0
   * @param {*String} apiAction 接口对应action的名称
   */
  initToggle ({ commit, dispatch, state }, apiAction) {
    commit('SET_API_TOGGLE_INIT', { apiAction })
  },
  /**
   * 设置关于app sdk的数据
   * @param {*} param0
   * @param {*Object} obj 需要存放在store.state.sdk里面的任意对象
   */
  setSdkData ({ commit, dispatch, state }, obj) {
    commit('SET_SDK_DATA', obj)
  },
  /**
   * 设置用户信息
   * @param {*} param0
   * @param {*Object} obj 需要存放在store.state.userInfo里面的任意对象
   */
  setUserInfo ({ commit, dispatch, state }, obj) {
    commit('SET_USER_INFO', obj)
  },
  /**
   * 设置url参数
   * @param {*} param0
   * @param {*Object} obj 需要存放在store.state.urlParams里面的任意对象
   */
  setUrlParams ({ commit, dispatch, state }, obj) {
    commit('SET_URL_PARAMS', obj)
  },
  /**
   * 弹窗开关
   * @param {*} param0
   * @param {*{name:String,visible:Boolean}} param1 弹窗名称 和 显示状态
   */
  dialogVisible ({ commit, dispatch, state }, { name, visible }) {
    commit('SET_DIALOG_VISIBLE', { name, visible })
  },
  watchScroll ({ commit, dispatch, state }) {
    window.onscroll = throttle((e) => {
      commit('SET_SCROLL', { x: window.scrollX, y: window.scrollY })
    }, 100)
  },
  /**
   * 判断app sdk是否注入
   * @param {*} param0
   * @param {*} param1
   */
  onSdkReady ({ commit, dispatch, state }, { times = 3, delay = 100 } = {}) {
    let apiAction = 'onSdkReady'
    commit('SET_API_TOGGLE_LOADING', { apiAction })
    return new Promise((resolve, reject) => {
      co(function * () {
        for (let i = 0; !window.RFBridge; i++) {
          // var now = Date.now();
          if (i >= times) {
            throw new Error('注入超时')
          }
          yield function (cb) {
            setTimeout(cb, delay)
          }
        }
      }).then(data => {
        dispatch('setSdkData', { isApp: true })
        commit('SET_API_TOGGLE_SUCCESS', { apiAction })
        resolve('注入成功')
      }).catch(reason => {
        dispatch('setSdkData', { isApp: false })
        commit('SET_API_TOGGLE_FAIL', { apiAction })
        reject(reason)
      })
    })
  },
  /**
   * 获取用户信息
   * @param {*} param0
   */
  getUserInfo ({ commit, dispatch, state }) {
    let apiAction = 'getUserInfo'
    commit('SET_API_TOGGLE_LOADING', { apiAction })
    return new Promise((resolve, reject) => {
      try {
        window.__onGetUserInfoSuccess = function (error, data) {
          if (error) {
            commit('SET_API_TOGGLE_FAIL', { apiAction })
            reject(error)
          } else {
            actions.setUserInfo({ commit, dispatch, state }, data)
            commit('SET_API_TOGGLE_SUCCESS', { apiAction })
            resolve(data)
          }
        }
        window.RFBridge.RFN_GetUserInfoWithCallbackFunctionName('__onGetUserInfoSuccess')
      } catch (error) {
        commit('SET_API_TOGGLE_FAIL', { apiAction })
        reject(error)
      }
    })
  },
  getQRcode ({ commit, dispatch, state }) {
    let apiAction = 'getQRcode'
    commit('SET_API_TOGGLE_LOADING', { apiAction })
    return new Promise((resolve, reject) => {
      try {
        window.__onGetQRcodeSuccess = function (error, data) {
          if (error) {
            commit('SET_API_TOGGLE_FAIL', { apiAction })
            reject(error)
          } else {
            // actions.setUserInfo({ commit, dispatch, state }, { accessToken: data.accessToken })
            commit('SET_API_TOGGLE_SUCCESS', { apiAction })
            resolve(data)
          }
        }
        window.RFBridge.RFN_GetQRCodeWithCallbackFunctionName('__onGetQRcodeSuccess')
      } catch (error) {
        commit('SET_API_TOGGLE_FAIL', { apiAction })
        reject(error)
      }
    })
  }
}
// 将api中定义的apiActions制作成action
for (let i in apiActions) {
  let obj = {
    [i]: ({ commit, dispatch, state }, { restfulParams = {}, params = {}, options = {} } = {}) => {
      let apiAction = i
      let axiosParams = {
        baseURL: '../../',
        method: apiActions[i].method,
        url: apiActions[i].url,
        data: params
      }
      axiosParams = Object.assign(axiosParams, options)
      // console.log(axiosParams)
      const showIndicator = ignoreIndicatorActionArr.indexOf(apiAction) === -1
      let loading = null
      if (showIndicator) {
        loading = router.app.$loading()
      }
      commit('SET_API_TOGGLE_LOADING', { apiAction })
      return new Promise((resolve, reject) => {
        axios(axiosParams).then(response => {
          if (showIndicator) {
            loading.close()
          }
          if (response.data.status === 200) { // 接口返回成功状态
            commit('SET_API_TOGGLE_SUCCESS', { apiAction })
            resolve(response.data)
          } else {
            if (response.data.status === 402) {
              const isIgnore = ignoreCheckLoginPathArr.find(n => router.app.$route.path.match(n) !== null)
              if (!isIgnore) {
                // TODO 跳转到登录页
              }
            }
            commit('SET_API_TOGGLE_FAIL', { apiAction })
            reject(response.data)
          }
        }).catch(error => {
          console.log(error)
          if (showIndicator) {
            loading.close()
          }
          if (error.message.match('Network Error')) {
            error.message = '网络不给力！'
          }
          commit('SET_API_TOGGLE_FAIL', { apiAction })
          reject(error)
        })
      })
    }
  }
  Object.assign(actions, obj)
}
export default actions

/**
 * 节流函数
 * @param {*} func
 * @param {*} wait
 * @param {*} options
 */
const throttle = function (func, wait, options) {
  /* options的默认值
   *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
   *  options.leading = true;
   * 表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
   *  options.trailing = true;
   * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
   */
  var context, args, result
  var timeout = null
  var previous = 0
  if (!options) options = {}
  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  return function () {
    var now = new Date().getTime()
    if (!previous && options.leading === false) previous = now
    // 计算剩余时间
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    // 当到达wait指定的时间间隔，则调用func函数
    // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
    if (remaining <= 0 || remaining > wait) {
      // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      // options.trailing=true时，延时执行func函数
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}
