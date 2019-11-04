import Vue from 'vue'
import Message from '@/components/Message/Message.js'
import muLoading from 'muse-ui-loading'
Vue.use(Message)
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
    console.log(options)
    Vue.prototype.$message({ text: options })
  } else {
    const { duration = 3000, type = 'info', message = '' } = options
    console.log(duration, type, message)
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
    console.log(`loading show ${this.methodQqueue.join(',')}`)
    // TODO show loading
    if (this.methodQqueue.length === 1) {
      // 引用第三方loading 开始
      this.loadingTarget = muLoading()
      try { this.loadingTarget.instance.$el.parentElement._isLoading = false } catch (e) { }
      console.log(this.loadingTarget)
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
        console.log(`loading close`)
        // 引用第三方loading 开始
        try { this.loadingTarget.close() } catch (e) { }
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
  DOMRectArr.push(e.target.getBoundingClientRect()) // 计数器加一（本事例的计数标识为对象位置，非必要）
}
/**
 * 失焦事件
 */
const handleInputBlur = e => {
  DOMRectArr.shift() // 移除计数标识
  // const boundingClientRect = DOMRectArr.shift() // 移除计数标识，并获取对象位置
  const timer = setTimeout(() => { // 延迟判断，以防切换下一个输入框时触发滚动
    clearTimeout(timer)
    if (DOMRectArr.length === 0) { // 最后一个输入框失焦时触发滚动
      window.scrollTo(0, 1) // 滚回顶部
      // window.scrollTo(0, window.scrollY + boundingClientRect.y) // 滚到当前元素位置（未经测试）
    }
  }, 0)
}
export {
  errorFormatter,
  ToastInterface,
  LoadingInterface,
  handleInputFocus,
  handleInputBlur
}
