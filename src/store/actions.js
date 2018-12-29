import axios from 'axios'
import router from '../router'
import { apiActions } from '../config/api'
import { CrossStorageClient } from '../cross'
const ignoreIndicatorActionArr = [] // 不显示loading的接口名称
const ignoreCheckLoginPathArr = [] // 不检查登录状态的页面 '/compere'
const co = require('co')
const $wx = window.wx
const qs = require('qs')
// axios解决后端接收不到post参数
axios.defaults.transformRequest = [function (data) {
  return qs.stringify(data)
}]
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
  /**
   * 监听滚动
   * @param {*} param0
   */
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
  connectToken ({ dispatch, commit, state }) {
    console.log('GET_ACCESS_TOKEN')
    return new Promise((resolve, reject) => {
      const URL = getConnectUrl()
      // console.log(URL)
      let storage = new CrossStorageClient(URL)
      storage.onConnect().then(() => {
        return storage.get('access_token')
      }).then(res => {
        commit('SET_USER_INFO', { accessToken: res })
        resolve(res)
      }).catch(err => {
        commit('CONNECT_TOKEN_FAIL')
        reject(err)
      })
    })
  },
  setAccessToken ({ dispatch, commit, state }, token) {
    return new Promise((resolve, reject) => {
      const URL = getConnectUrl()
      let storage = new CrossStorageClient(URL)
      storage.onConnect()
        .then(() => {
          return storage.set('access_token', token)
        }).then(res => {
          resolve(res)
        }).catch(err => {
          commit('CONNECT_TOKEN_FAIL')
          reject(err)
        })
    })
  },
  gotoLogin ({ dispatch, commit, state }, redirectUrl = location.href) {
    const URL = getConnectUrl()
    let params = {}
    if (redirectUrl) {
      params.redirect_url = redirectUrl
    }
    if (state.connectTokenFail) {
      params.type = 'params'
      const redirect = redirectUrl || location.href
      params.redirect_url = redirect
    }
    if (params.redirect_url) {
      params.redirect_url = encodeURIComponent(deleteQueryFromUrlHash(params.redirect_url, 'access_token'))
    }
    const paramsArr = Object.keys(params).map(key => `${key}=${params[key]}`)
    window.location.href = `${URL}?${paramsArr.join('&')}`
  },
  logout ({ dispatch, commit, state }) {
    return new Promise(async (resolve, reject) => {
      try { await dispatch('setAccessToken', '') } catch (e) { console.log(e) }
      dispatch('gotoLogin')
      resolve()
    })
  },
  /**
   * 获取用户信息
   * @param {*} param0
   */
  getUserInfoApp ({ commit, dispatch, state }) {
    let apiAction = 'getUserInfoApp'
    commit('SET_API_TOGGLE_LOADING', { apiAction })
    return new Promise((resolve, reject) => {
      try {
        window.__onGetUserInfoSuccess = function (error, data) {
          if (error) {
            commit('SET_API_TOGGLE_FAIL', { apiAction })
            reject(error)
          } else {
            commit('SET_USER_INFO', data)
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
  /**
   * 唤起app登录页面
   * @param {*} param0
   */
  loginApp ({ commit, dispatch, state }) {
    let apiAction = 'loginApp'
    commit('SET_API_TOGGLE_LOADING', { apiAction })
    return new Promise((resolve, reject) => {
      try {
        window.__onCheckLogin = function (error, data) {
          if (error) {
            commit('SET_API_TOGGLE_FAIL', { apiAction })
            reject(error)
          } else {
            if (!data.accessToken) {
              commit('SET_API_TOGGLE_FAIL', { apiAction })
              reject(new Error('没有accessToken'))
              return
            }
            commit('SET_USER_INFO', data)
            commit('SET_API_TOGGLE_SUCCESS', { apiAction })
            resolve(data)
          }
        }
        if (state.browser.versions.android) {
          // android 慢
          let timer = setTimeout(function () {
            clearTimeout(timer)
            window.RFBridge.RFN_LoginWithCallbackFunctionName('__onCheckLogin')
          }, 1000)
        } else {
          window.RFBridge.RFN_LoginWithCallbackFunctionName('__onCheckLogin')
        }
      } catch (error) {
        commit('SET_API_TOGGLE_FAIL', { apiAction })
        reject(error)
      }
    })
  },
  /**
   * 唤起app摄像头扫码
   * @param {} param0
   */
  getQRcodeApp ({ commit, dispatch, state }) {
    let apiAction = 'getQRcodeApp'
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
  },
  collectActivityApp ({ commit, dispatch, state }, { activityId, type }) {
    // APP内收藏功能 第一个参数活动ID，第二个参数1表示社区的活动，2表示生活的活动
    return new Promise((resolve, reject) => {
      try {
        if (window.RFBridge) {
          window.RFBridge.RFN_enableFavorWithIdAndCategory(activityId, type)
        } else {
          let timer = setTimeout(function () {
            clearTimeout(timer)
            window.RFBridge.RFN_enableFavorWithIdAndCategory(activityId, type)
          }, 1000)
        }
      } catch (error) {
        reject(error)
      }
    })
  },
  /**
   *  分享链接到社交网络，所有参数必须为字符串
   *  @param title 分享的标题
   *  @param desc 分享的描述
   *  @param thumbnail 分享的缩略图URL
   *  @param link 分享的链接
   *  @param wechatFrdTitle 朋友圈分享的标题
   *  @param callbackFunc 回调函数, callbackFunc(param1, param2, param3) 接收两个参数，param1:是否出错 error\null
   *  param2:状态 'click'\'success'\'cancel' 点击，成功，取消
   *  param3: 渠道 InApp\WeChatFrd\WeChatTimeline\Weibo\QQFrd\CopyLink
   */
  socialShareApp ({ commit, dispatch, state }, { title, desc, thumbnail, link, wechatFrdTitle, type, channel }) {
    return new Promise((resolve, reject) => {
      try {
        window.__onShareApp = function (error, type, channel) {
          if (error) {
            reject(error)
          } else {
            // 数果，百度统计
            window._hmt.push(['_trackEvent', 'app分享', type, channel])
            resolve(type, channel)
          }
        }
        if (window.RFBridge) {
          window.RFBridge.RFN_SocialShareWithTitleDescThumbnailLinkWechatTitleCallbackFunctionName(title, desc, thumbnail, link, wechatFrdTitle, '__onShareApp')
        } else {
          let timer = setTimeout(function () {
            clearTimeout(timer)
            window.RFBridge.RFN_SocialShareWithTitleDescThumbnailLinkWechatTitleCallbackFunctionName(title, desc, thumbnail, link, wechatFrdTitle, '__onShareApp')
          }, 1000)
        }
      } catch (error) {
        reject(error)
      }
    })
  },
  /**
   * 初始化微信分享
   * @param {*} param0
   * @param {*} param1
   */
  initWxShare ({ commit, dispatch, state }, { debug = false, appId, timestamp, nonceStr, signature } = {}) {
    let apiAction = 'initWxShare'
    commit('SET_API_TOGGLE_LOADING', { apiAction })
    return new Promise((resolve, reject) => {
      $wx.config({
        debug,
        appId,
        timestamp,
        nonceStr,
        signature,
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'translateVoice',
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'playVoice',
          'onVoicePlayEnd',
          'pauseVoice',
          'stopVoice',
          'uploadVoice',
          'downloadVoice',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'getNetworkType',
          'openLocation',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow',
          'scanQRCode',
          'chooseWXPay',
          'openProductSpecificView',
          'addCard',
          'chooseCard',
          'openCard',
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'getLocalImgData'
        ]
      })
      $wx.ready(() => {
        dispatch('setSdkData', { isWxReady: true })
        commit('SET_API_TOGGLE_SUCCESS', { apiAction })
        resolve('wx ready')
        // $wx.checkJsApi({
        //   jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        //   success: function (res) {
        //     alert(JSON.stringify(res))
        //   // 以键值对的形式返回，可用的api值true，不可用为false
        //   // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        //   }
        // })
      })
    })
  },
  /**
   * 更改微信分享内容
   * @param {*} param0
   * @param {*{ icon：分享小图, title：分享标题, desc：分享描述, desc_timeline：朋友圈分享描述, link：分享链接 }} param1
   */
  changeWxShare ({ commit, dispatch, state }, { icon, title, desc, descTimeline, link }) {
    // return new Promise((resolve, reject) => {
    let shareData = {
      friendQQ: {
        info: {
          imgUrl: icon,
          link: link,
          title: title,
          desc: desc
        },
        callback: function (res) {
          alert('friendQQ:' + JSON.stringify(res))
          window._hmt.push(['_trackEvent', '分享到朋友或QQ', 'success', 'weixin'])
        }
      },
      TimelineQzone: {
        info: {
          imgUrl: icon,
          link: link,
          title: title
        },
        callback: (res) => {
          alert('TimelineQzone:' + JSON.stringify(res))
          window._hmt.push(['_trackEvent', '分享到朋友圈或QQ空间', 'success', 'weixin'])
        }
      },
      Default: {
        imgUrl: icon,
        link: link,
        title: title,
        desc: desc,
        success: function (res) {
          // 统计代码
          window._hmt.push(['_trackEvent', '微信分享', 'success', 'weixin'])
        }
      },
      Timeline: {
        imgUrl: icon,
        link: link,
        title: descTimeline,
        success: function (res) {
          // 统计代码
          window.MtaH5.clickShare('wechat_moments')
          window.MtaH5.clickStat('wechat_moments')
        }
      },
      QQ: {
        imgUrl: icon,
        link: link,
        title: title,
        desc: desc,
        success: function (res) {
          // 统计代码
          window.MtaH5.clickShare('qq')
          window.MtaH5.clickStat('qq')
        }
      },
      Weibo: {
        imgUrl: icon,
        link: link,
        title: title,
        desc: desc,
        success: function (res) {
          // 统计代码
          window.MtaH5.clickShare('sina')
          window.MtaH5.clickStat('sina')
        }
      },
      QZone: {
        imgUrl: icon,
        link: link,
        title: title,
        desc: desc,
        success: function (res) {
          // 统计代码
          window.MtaH5.clickShare('qzone')
          window.MtaH5.clickStat('qzone')
        }
      }
    }
    $wx.onMenuShareAppMessage(shareData.Default)
    $wx.onMenuShareTimeline(shareData.Timeline)
    $wx.onMenuShareQQ(shareData.QQ)
    $wx.onMenuShareWeibo(shareData.Weibo)
    $wx.onMenuShareQZone(shareData.QZone)

    $wx.updateAppMessageShareData(shareData.friendQQ.info, shareData.friendQQ.callback)
    $wx.updateTimelineShareData(shareData.TimelineQzone.info, shareData.TimelineQzone.callback)
  }
}
// 将api中定义的apiActions制作成action
for (let i in apiActions) {
  let obj = {
    [i]: ({ commit, dispatch, state }, { restfulParams = {}, params = {}, options = {} } = {}) => {
      let apiAction = i
      let userRequestData = !!['PUT', 'POST', 'PATCH'].find(method => apiActions[i].method.toUpperCase() === method)
      let axiosParams = {
        baseURL: '../../',
        method: apiActions[i].method,
        url: apiActions[i].url,
        data: userRequestData ? params : null,
        params: userRequestData ? null : params
      }
      axiosParams = Object.assign(axiosParams, options)
      console.log(axiosParams)
      const showIndicator = ignoreIndicatorActionArr.indexOf(apiAction) === -1
      let loading = null
      if (showIndicator) {
        loading = router.app.$loading()
        try { loading.instance.$el.parentElement._isLoading = false } catch (e) { }
      }
      commit('SET_API_TOGGLE_LOADING', { apiAction })
      return new Promise((resolve, reject) => {
        axios(axiosParams).then(response => {
          console.log(response)
          try { showIndicator && loading.close() } catch (e) { }
          if (response.data.status === 200) { // 接口返回成功状态
            commit('SET_API_TOGGLE_SUCCESS', { apiAction })
            commit('SET_API_DATA', { apiAction, data: response.data.data })
            resolve(response.data)
          } else {
            if (response.data.status === 402) {
              const isIgnore = ignoreCheckLoginPathArr.find(n => router.app.$route.path.match(n) !== null)
              if (!isIgnore) {
                // TODO 跳转到登录页
                dispatch('gotoLogin')
              }
            }
            commit('SET_API_TOGGLE_FAIL', { apiAction })
            reject(response.data)
          }
        }).catch(error => {
          console.log(error)
          try { showIndicator && loading.close() } catch (e) { }
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
// const GetRequest = () => {
//   var url = location.search // 获取url中"?"符后的字串
//   var theRequest = {}
//   if (url.indexOf('?') !== -1) {
//     var str = url.substr(1)
//     var strs = str.split('&')
//     for (var i = 0; i < strs.length; i++) {
//       theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
//     }
//   }
//   return theRequest
// }
const getConnectUrl = () => {
  let buildType = process.env.VUE_APP_BUILD_TYPE
  const protocol = window.__wxjs_environment === 'miniprogram' ? 'https:' : 'http:'
  if (buildType === 'development') {
    // return 'http://192.168.198.179:7777';
    return protocol + '//weixin.test.rfmember.net/zizai/universal-login/'
    // return 'http://t.api.zizai.rfmember.net/universal-login';
  } else if (buildType === 'test') {
    // return 'http://t.api.zizai.rfmember.net/universal-login';
    return protocol + '//weixin.test.rfmember.net/zizai/universal-login/'
  } else {
    return protocol + '//api.guanjia.thinkinpower.com/zizai/universal-login/'
  }
}
/**
 * 删除给定的url的hash中的某个参数
 * @param {*} url
 */
const deleteQueryFromUrlHash = (url, queryName) => {
  let urlObj = {}
  try {
    urlObj = new window.URL(url)
    if (urlObj.hash.indexOf('?') !== -1) {
      const hashArr = urlObj.hash.split('?')
      const queryArr = hashArr[1].split('&')
      const queryArrNew = queryArr.filter(query => !query.match(queryName))
      urlObj.hash = hashArr[0] + '?' + queryArrNew.join('&')
    }
  } catch (e) { }
  return urlObj.href || url
}
