import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import Toggle from '../config/Toggle'
import { apiActions } from '../config/api'
// import actInfo from '../assets/datas/actInfo'

Vue.use(Vuex)

const state = {
  urlParams: GetRequest(),
  scroll: {
    x: 0,
    y: 0
  },
  api: {
    onSdkReady: {
      toggle: new Toggle(),
      data: null
    },
    getQRcodeApp: {
      toggle: new Toggle(),
      data: null
    },
    getUserInfoApp: {
      toggle: new Toggle(),
      data: null
    },
    initWxShare: {
      toggle: new Toggle(),
      data: null
    }
  },
  sdk: {
    isApp: false
  },
  userInfo: {},
  browser: {
    versions: (function () {
      var u = navigator.userAgent
      // var app = navigator.appVersion
      return { // 移动终端浏览器版本信息
        IE: u.indexOf('MSIE') > -1, // IE内核
        presto: u.indexOf('Presto') > -1, // opera内核
        webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
        iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, // 是否iPad
        webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
        weChat: !!u.match(/MicroMessenger/i), // 是否微信
        aliPay: !!u.match(/Alipay/i) // 是否支付宝
      }
    }()),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  }
}
for (let i in apiActions) {
  let obj = {
    toggle: new Toggle(),
    data: null
  }
  Object.assign(state.api, { [i]: obj })
}
export default new Vuex.Store({
  state,
  actions,
  mutations
})

function GetRequest () {
  var url = location.search // 获取url中"?"符后的字串
  var theRequest = {}
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1)
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return theRequest
}
