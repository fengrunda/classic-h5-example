// 不要在此引用第三方库样式
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { errorFormatter, ToastInterface, LoadingInterface, handleInputFocus, handleInputBlur } from './config/utils'
import { Progress } from 'muse-ui'
import Helpers from 'muse-ui/lib/Helpers' // muse-ui-loading 依赖这个的transition
Vue.use(Progress)
Vue.use(Helpers)
Vue.config.productionTip = false
Vue.prototype.$toast = ToastInterface
Vue.prototype.$loading = LoadingInterface
Vue.prototype.$errorFormatter = errorFormatter
Vue.prototype.$handleInputFocus = handleInputFocus
Vue.prototype.$handleInputBlur = handleInputBlur

let isFirstVisit = true
router.beforeEach(async (to, from, next) => {
  // 页面切换开始时展示loading
  LoadingInterface.open(`route:${to.name}`)
  if (isFirstVisit) {
    isFirstVisit = false
    next()
    return
  }
  next()
})
router.afterEach(() => {
  // 页面切换结束时关闭loading
  LoadingInterface.close()
})
// 解决重新构建后异步加载的页面报错
router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (isChunkLoadFailed) {
    location.reload()
  }
})

const DOMRectArr = []
Vue.prototype.$handleInputFocus = e => {
  // e.stopPropagation()
  // e.preventDefault()
  console.log(e.timeStamp)
  if (DOMRectArr.length > 0) {
    let last = DOMRectArr[DOMRectArr.length - 1]
    if (e.timeStamp - last > 500) {
      DOMRectArr.push(e.timeStamp)
    }
  } else {
    DOMRectArr.push(e.timeStamp)
  }
  // DOMRectArr.push(e.path.join(','))
  // Toast({ duration: 999999, message: `Focus:${DOMRectArr.join(';')}` })
}
Vue.prototype.$handleInputBlur = e => {
  DOMRectArr.shift()
  const timer = setTimeout(() => {
    // Toast({ duration: 3000, message: `Blur:${DOMRectArr.join(';')}` })
    clearTimeout(timer)
    if (DOMRectArr.length === 0) {
      window.scrollTo({
        top: 1,
        behavior: 'smooth'
      })
    }
  }, 200)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
