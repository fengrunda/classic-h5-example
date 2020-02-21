import Vue from 'vue'
// import Message from '@/components/Message/Message.js'
import { Toast } from 'vant'
import { CrossStorageClient } from '@/cross'
// Vue.use(Message)
/**
 * 错误信息字符化
 * @param {*} error 错误对象
 * @param {String} methodName 方法名称
 */
const errorFormatter = (error, methodName) => {
  // let msg = error instanceof Error ? error.toString() : error.message || JSON.stringify(error)
  let msg = error.message || (error instanceof Error ? error.toString() : JSON.stringify(error))
  // 开发测试环境显示错误方法名
  if (methodName && process.env.VUE_APP_BUILD_TYPE !== 'production') {
    msg = methodName + ':' + msg
  }
  return msg
}
/**
 * Toast接口
 * @param {*} options 错误信息或者配置对象
 */
const ToastInterface = options => {
  if (typeof options === 'string') {
    // console.log(options)
    Vue.prototype.$message({ text: options })
  } else {
    const { duration = 3000, type = 'info', message = '' } = options
    // console.log(duration, type, message)
    Vue.prototype.$message({ duration, type, text: message })
  }
}
/**
 * loading 类
 */
class Loading {
  methodQqueue = [] // 调用loading的方法队列
  open (methodName = Math.round(Math.random() * 1000000000).toString()) {
    this.methodQqueue.push(methodName)
    // console.log(`loading show ${this.methodQqueue.join(',')}`)
    // TODO show loading
    if (this.methodQqueue.length === 1) {
      // 引用第三方loading 开始
      this.loadingTarget = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '',
        className: 'toast-loading'
      })
      // try { this.loadingTarget.instance.$el.parentElement._isLoading = false } catch (e) { }
      // console.log(this.loadingTarget)
      // 引用第三方loading 结束
    }
  }
  close () {
    // 使用同一个loading实例无缝衔接下一个loading
    const timer = setTimeout(() => {
      this.methodQqueue.shift()
      clearTimeout(timer)
      if (this.methodQqueue.length === 0) {
        // TODO show loading
        // console.log(`loading close`)
        // 引用第三方loading 开始
        try { this.loadingTarget.clear() } catch (e) { }
        // 引用第三方loading 结束
      }
    }, 0)
  }
}
const LoadingInterface = new Loading()

// 解决原生键盘导致页面错位
const DOMRectArr = []
/**
 * 聚焦事件
 */
const handleInputFocus = e => {
  if (DOMRectArr.length > 0) {
    let { timeStamp = 0 } = DOMRectArr[DOMRectArr.length - 1] || {}
    if (e.timeStamp - timeStamp > 500) {
      DOMRectArr.push(e) // 存储事件对象
    } else {
      DOMRectArr[DOMRectArr.length - 1] = e // 短时间内切换输入对象则替换原来的事件
    }
  } else {
    DOMRectArr.push(e) // 存储事件对象
  }
}
/**
 * 失焦事件
 */
const handleInputBlur = e => {
  const event = DOMRectArr.shift() // 移除计数标识，并获取事件对象
  const { target = {} } = event || {}
  let y = 1
  try {
    const boundingClientRect = target.getBoundingClientRect() || {} // 获取事件元素位置
    y = boundingClientRect.y || 1
  } catch (error) { }
  const timer = setTimeout(() => { // 延迟判断，以防切换下一个输入框时触发滚动
    clearTimeout(timer)
    if (DOMRectArr.length === 0) { // 最后一个输入框失焦时触发滚动
      // window.scrollTo(0, 1) // 滚回顶部
      window.scrollTo(0, window.scrollY + y) // 滚到当前元素位置（未经测试）
    }
  }, 200)
}

const connectCrossStorage = async (CROSS_URL) => {
  try {
    let storage = new CrossStorageClient(CROSS_URL)
    await storage.onConnect()
    console.log('connectCrossStorage', storage)
    return Promise.resolve(storage)
  } catch (error) {
    return Promise.reject(error)
  }
}

const CROSS_URL = (() => {
  let buildType = process.env.VUE_APP_BUILD_TYPE
  if (buildType === 'development') {
    // return 'http://192.168.198.179:7777';
    return 'https://weixin.test.rfmember.net/zizai/universal-login/'
  } else if (buildType === 'test') {
    // return 'http://t.api.zizai.rfmember.net/universal-login';
    return 'https://weixin.test.rfmember.net/zizai/universal-login/'
  } else {
    return 'https://weixin.thinkinpower.com/zizai/universal-login/'
  }
})()

// 获取app浏览器版本
const BROWSER_VERSION = (() => {
  let u = navigator.userAgent
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
    miniprogram: window.__wxjs_environment === 'miniprogram', // 是否小程序
    aliPay: !!u.match(/Alipay/i) // 是否支付宝
  }
})()

// 获取url中的参数
const getUrlParams = (url) => {
  const pattern = /(\w+)=((\w|\.|-|%)+)/ig
  let params = {}
  url.replace(pattern, function (str, key, value) {
    params[key] = value
  })
  return params
}

/**
 * 获取后缀
 * @param {*String} url
 */
const getSuffix = (url) => {
  var index1 = url.lastIndexOf('.')
  var index2 = url.length
  var suffix = url.substring(index1, index2)
  return suffix
}

export {
  errorFormatter,
  ToastInterface,
  LoadingInterface,
  handleInputFocus,
  handleInputBlur,
  CROSS_URL,
  connectCrossStorage,
  getSuffix,
  BROWSER_VERSION,
  getUrlParams
}
